#!/usr/bin/env python3
"""Self-contained spec validator for spec-forge-runway skill.

Validates a single-feature YAML spec against the canonical vocabulary.
Exit codes: 0=valid, 1=validation errors, 2=file/parse error.

Usage:
    python3 validate_spec.py <path-to-yaml>
"""
import sys
import re
import json

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(2)

# -------------------- CANONICAL VOCABULARY --------------------
VALID_VERIFICATION_TYPES = {"http", "cli", "file_exists", "manual"}
VALID_GLOBAL_GOALS = {f"G{i}" for i in range(1, 20)}
REQUIRED_TOP_LEVEL = ["task_id", "summary", "local_goals", "context"]
OPTIONAL_TOP_LEVEL = {"depends_on", "global_goals_refs"}

REQUIRED_VERIFICATION_FIELDS = {
    "http": ["method", "url"],
    "cli": ["command"],
    "file_exists": ["path"],
    "manual": [],
}

VALID_EXPECT_KEYS = {
    "http": {"status", "body_regex", "body_contains", "json_schema", "headers_contain"},
    "cli": {"exit_code", "stdout_regex", "stdout_contains", "stdout_lines_min"},
    "file_exists": {"content", "content_contains", "content_not_contains", "exists"},
    "manual": set(),
}

REQUIRED_EXPECT_KEYS = {
    "http": {"status"},
    "cli": {"exit_code"},
    "file_exists": set(),
    "manual": set(),
}

FILE_EXISTS_MIN_ONE = {"content", "content_contains", "content_not_contains", "exists"}
MIN_LOCAL_GOALS = 2
MIN_NONTRIVIAL_CMD_LEN = 3
EXPRESSION_PATTERN = re.compile(r'[*+/%]\s*\d+|\d+\s*[*+/%]|def\s+|import\s+|\.\.\.')

# -------------------- YAML PRE-PROCESSOR --------------------
_YAML_DOUBLE_QUOTED_ESCAPES = set('0abtnvfreNLP"\\/ xueU ')


def _has_invalid_backslash_escape(s):
    i = 0
    while i < len(s) - 1:
        if s[i] == "\\":
            nxt = s[i + 1]
            if nxt in ("x", "u", "U"):
                return False
            if nxt not in _YAML_DOUBLE_QUOTED_ESCAPES:
                return True
            i += 2
        else:
            i += 1
    return False


def preprocess_yaml(yaml_str):
    fixed_lines = []
    dq_pattern = re.compile(r':\s*"([^"\\]*(?:\\.[^"\\]*)*)"')
    for line in yaml_str.splitlines():
        m = dq_pattern.search(line)
        if m:
            quoted_value = m.group(1)
            if _has_invalid_backslash_escape(quoted_value):
                single_quoted_value = quoted_value.replace("'", "''")
                new_line = line[:m.start()] + ": '" + single_quoted_value + "'" + line[m.end():]
                fixed_lines.append(new_line)
                continue
        fixed_lines.append(line)
    result = "\n".join(fixed_lines)
    if yaml_str.endswith("\n"):
        result += "\n"
    return result


# -------------------- HELPERS --------------------
def _contains_ref(schema):
    if isinstance(schema, dict):
        if "$ref" in schema:
            return True
        for v in schema.values():
            if _contains_ref(v):
                return True
    elif isinstance(schema, list):
        for item in schema:
            if _contains_ref(item):
                return True
    return False


def _has_definitions(schema):
    return isinstance(schema, dict) and "definitions" in schema


def _near_duplicate(a, b):
    if a.get("type") != b.get("type"):
        return False
    t = a.get("type")
    if t == "file_exists":
        if a.get("path", "") != b.get("path", ""):
            return False
        return set(a.get("expect", {}).keys()) == set(b.get("expect", {}).keys())
    if t == "http":
        ua = re.sub(r"\{[^}]+\}", "{}", a.get("url", ""))
        ub = re.sub(r"\{[^}]+\}", "{}", b.get("url", ""))
        if ua != ub or a.get("method", "") != b.get("method", ""):
            return False
        if a.get("headers", {}) != b.get("headers", {}):
            return False
        return set(a.get("expect", {}).keys()) == set(b.get("expect", {}).keys())
    if t == "cli":
        return a.get("command", "") == b.get("command", "")
    return False


# -------------------- MAIN VALIDATOR --------------------
def validate_spec(yaml_str):
    yaml_str = preprocess_yaml(yaml_str)
    errors = []
    try:
        spec = yaml.safe_load(yaml_str)
    except yaml.YAMLError as e:
        msg = str(e)
        if "alias" in msg:
            return [f"Invalid YAML: {msg}. Avoid expressions like \"A\" * 101."]
        return [f"Invalid YAML: {e}"]

    if not isinstance(spec, dict):
        return ["Top level must be a dictionary"]

    for field in REQUIRED_TOP_LEVEL:
        if field not in spec:
            errors.append(f"Missing required top-level field: {field}")
    unknown_toplevel = set(spec.keys()) - set(REQUIRED_TOP_LEVEL) - OPTIONAL_TOP_LEVEL
    if unknown_toplevel:
        errors.append(
            f"Unknown top-level fields: {sorted(unknown_toplevel)}. "
            f"Allowed: {sorted(set(REQUIRED_TOP_LEVEL) | OPTIONAL_TOP_LEVEL)}"
        )

    tid = spec.get("task_id")
    if tid is not None and not (isinstance(tid, str) and tid.strip()):
        errors.append("task_id must be a non-empty string")

    if "global_goals_refs" in spec and spec["global_goals_refs"]:
        for ref in spec["global_goals_refs"]:
            if ref not in VALID_GLOBAL_GOALS:
                errors.append(f"Invalid global_goals_refs: '{ref}'. Must be one of {sorted(VALID_GLOBAL_GOALS)}")

    goals = spec.get("local_goals", [])
    if not isinstance(goals, list):
        errors.append("local_goals must be a list")
        return errors

    if len(goals) < MIN_LOCAL_GOALS:
        errors.append(f"local_goals must have at least {MIN_LOCAL_GOALS} goals (found {len(goals)})")

    seen_ids = set()
    verifications = []
    for i, goal in enumerate(goals):
        gid = goal.get("id") if isinstance(goal, dict) else None
        if not gid:
            errors.append(f"Goal {i}: missing 'id'")
            continue
        if not re.match(r"^L[A-Za-z0-9]+", gid):
            errors.append(f"Goal '{gid}': id must start with 'L' followed by letters/digits (e.g., L1, L2A)")
        if gid in seen_ids:
            errors.append(f"Duplicate goal ID: {gid}")
        seen_ids.add(gid)

        ver = goal.get("verification")
        if not isinstance(ver, dict):
            errors.append(f"Goal {gid}: missing or non-dict 'verification'")
            continue

        vtype = ver.get("type")
        if vtype not in VALID_VERIFICATION_TYPES:
            errors.append(f"Goal {gid}: unknown verification type '{vtype}'. Must be one of {sorted(VALID_VERIFICATION_TYPES)}")
            continue

        req_fields = REQUIRED_VERIFICATION_FIELDS.get(vtype, [])
        for rf in req_fields:
            val = ver.get(rf)
            if val is None or (isinstance(val, str) and not val.strip()):
                errors.append(f"Goal {gid}: {vtype} verification missing '{rf}'")

        if vtype == "manual":
            if not ver.get("description", "").strip():
                errors.append(f"Goal {gid}: manual verification requires a 'description'")
            continue

        if vtype == "cli":
            cmd = ver.get("command", "")
            if cmd and len(cmd.strip()) < MIN_NONTRIVIAL_CMD_LEN:
                errors.append(f"Goal {gid}: cli command is trivial ({len(cmd.strip())} chars) — must be a real command")

        if vtype == "http":
            body = ver.get("body", {})
            try:
                body_str = json.dumps(body)
                if EXPRESSION_PATTERN.search(body_str):
                    errors.append(f"Goal {gid}: body contains code-like expression, use literal strings")
            except Exception as e:
                errors.append(f"Goal {gid}: body is not valid JSON: {e}")
            schema = ver.get("expect", {}).get("json_schema")
            if schema:
                if _contains_ref(schema):
                    errors.append(f"Goal {gid}: json_schema must be inline, no $ref")
                if _has_definitions(schema):
                    errors.append(f"Goal {gid}: json_schema must be inline, no 'definitions'")

        expect = ver.get("expect", {})
        if expect is None:
            expect = {}
        if not isinstance(expect, dict):
            errors.append(f"Goal {gid}: 'expect' must be a dict, got {type(expect).__name__}")
            continue
        valid_keys = VALID_EXPECT_KEYS.get(vtype, set())
        unknown_expect = set(expect.keys()) - valid_keys
        if unknown_expect:
            errors.append(f"Goal {gid}: unknown expect keys {sorted(unknown_expect)} for type '{vtype}'. Valid: {sorted(valid_keys) or '(none)'}")

        req_expect = REQUIRED_EXPECT_KEYS.get(vtype, set())
        for rk in req_expect:
            if rk not in expect:
                errors.append(f"Goal {gid}: {vtype} verification requires expect.{rk}")

        if vtype == "file_exists":
            present = set(expect.keys()) & FILE_EXISTS_MIN_ONE
            if not present:
                errors.append(f"Goal {gid}: file_exists verification needs at least one of expect.{sorted(FILE_EXISTS_MIN_ONE)} (found none)")

        verifications.append((gid, ver))

    for i in range(len(verifications)):
        for j in range(i + 1, len(verifications)):
            id_i, v_i = verifications[i]
            id_j, v_j = verifications[j]
            if _near_duplicate(v_i, v_j):
                errors.append(f"Goals {id_i} and {id_j}: near-duplicate verification (type={v_i.get('type')}, same target). Each goal should verify a distinct aspect.")

    return errors


# -------------------- CLI --------------------
def main():
    if len(sys.argv) < 2:
        print("Usage: python3 validate_spec.py <path-to-yaml>", file=sys.stderr)
        sys.exit(2)

    path = sys.argv[1]
    try:
        with open(path) as f:
            yaml_str = f.read()
    except FileNotFoundError:
        print(f"ERROR: file not found: {path}", file=sys.stderr)
        sys.exit(2)

    errors = validate_spec(yaml_str)
    if errors:
        print(f"❌ Spec failed validation ({len(errors)} errors):", file=sys.stderr)
        for err in errors[:8]:
            print(f"  - {err}", file=sys.stderr)
        if len(errors) > 8:
            print(f"  ... and {len(errors) - 8} more", file=sys.stderr)
        sys.exit(1)

    print("✅ Spec is valid.")
    sys.exit(0)


if __name__ == "__main__":
    main()
