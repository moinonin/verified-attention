# TypeScript Monorepo + Zod: Test Plumbing Pitfalls

Durable traps encountered during Sprint 2 of the Verified Attention Engine (TS monorepo, pnpm + Turborepo, Zod schemas, Vitest). None are environment-specific — all are general technique lessons that will recur in any similar stack. These surface during the ✎ mutate and ✓ verify phases of a COMMAND_RUNWAY stage.

## 1. Zod `.datetime({ precision: N })` rejects standard JS ISO timestamps

**Symptom:** Evidence/observation tests using `new Date().toISOString()` as a timestamp value fail schema validation with "Invalid datetime". Tests using a hardcoded `2024-01-15T10:30:00.123456Z` (6-digit microseconds) pass.

**Root cause:** `z.string().datetime({ precision: 6 })` requires EXACTLY 6 decimal digits. `new Date().toISOString()` produces 3 digits (`2024-07-23T07:04:40.123Z`). The `precision` option is strict exactness, not a minimum.

**Fix:** Remove the fixed `precision` constraint if the schema should accept both ms and μs:
```ts
// BAD — rejects standard JS timestamps
export const TimestampSchema = z.string().datetime({ precision: 6, offset: true });

// GOOD — accepts variable precision (0-6 digits), Z and offset
export const TimestampSchema = z.string().datetime({ offset: true });
```

**Decision rule:** Only use `precision: N` if the spec mandates exact precision. VAP says "RFC 3339" — which allows variable precision. Forcing μs is stricter than the spec requires and breaks interop with standard JS `Date` output.

**Diagnostic:** If timestamps fail validation, write a minimal debug test that parses a `new Date().toISOString()` value against the schema and prints the Zod issues — the `"validation": "datetime"` issue tells you immediately.

## 2. tsdown produces `.js`, not `.mjs` — package.json exports must match

**Symptom:** `vitest` fails to resolve a workspace dependency: `Failed to resolve entry for package "@scope/pkg". The package may have incorrect main/module/exports specified in its package.json.`

**Root cause:** tsdown (used by this monorepo) outputs `dist/index.js` only — no `.mjs` file. But `package.json` `exports.import` pointed to `./dist/index.mjs`. Vite/Vitest respects the `exports` field and tries to load the non-existent `.mjs`.

**Fix:** Check `ls dist/` to see actual output, then point exports to what exists:
```json
// BAD — .mjs doesn't exist
"exports": { ".": { "import": "./dist/index.mjs", "require": "./dist/index.js" } }

// GOOD — both point to the file tsdown actually produces
"exports": { ".": { "import": "./dist/index.js", "require": "./dist/index.js" } }
```

**Rule:** After adding or changing a build tool, run `ls dist/` and confirm the `exports` field matches the actual filenames. tsdown, tsup, and tsc have different default output extensions — don't assume `.mjs`.

## 3. Cross-package test imports in pnpm workspaces require the dependency to be BUILT

**Symptom:** Tests in `packages/pipeline` import from `@verified-attention/store`. Vite fails to resolve the package even though the import path is correct and the dep is in `package.json`.

**Root cause sequence of what was missing:**
1. `@verified-attention/store` was not listed in `packages/pipeline/package.json` dependencies
2. Even after adding the dep + `pnpm install`, the store's `dist/` didn't exist (hadn't been built)
3. Vite resolves workspace packages via their `dist/` output, not their `src/`

**Fix sequence:**
```bash
# 1. Add the workspace dependency in the consumer package.json
#    "dependencies": { "@verified-attention/store": "workspace:*" }
pnpm install

# 2. Build the dependency FIRST so dist/ exists
cd packages/store && pnpm build

# 3. Now tests in pipeline can resolve store
cd packages/pipeline && pnpm test
```

**Rule:** In pnpm workspaces with compiled packages, a package's tests can only import another workspace package after that package has been built (its `dist/` must exist). If you add a cross-package import, build the dependency before running the consumer's tests.

## 4. `write_file` pagination guard — re-read full file before rewriting

**Symptom:** `write_file` on a test file produces a warning: `was last read with offset/limit pagination (partial view). Re-read the whole file before overwriting it.` The write may be truncated or blocked.

**Root cause:** If you previously called `read_file` with `offset`/`limit` on a file, the tool marks it as partially-read. A subsequent `write_file` guards against blind overwrites by warning or truncating.

**Fix:** Before rewriting a file that was paginated, call `read_file` with no `offset`/`limit` (or `limit: 2000`) to load the full content into context, then `write_file`.

**Rule:** The ⏾-before-✎ discipline applies to full-file rewrites too. If you read a slice, you don't have the whole file — re-read it fully before `write_file`.

## 5. Debugging schema validation failures — minimal reproducer pattern

When a test fails with a Zod validation error and you can't see why from the test output, write a minimal debug test that parses a known value against the schema and `console.log`s the issues:

```ts
import { describe, it, expect } from 'vitest';
import { EvidenceSchema } from '@verified-attention/core';

describe('debug', () => {
  it('parse evidence', () => {
    const ev = { /* minimal valid-shaped object */ };
    const r = EvidenceSchema.safeParse(ev);
    if (!r.success) console.log(JSON.stringify(r.error.issues, null, 2));
    expect(r.success).toBe(true);
  });
});
```

Run with `pnpm test debug` to see the exact Zod issues (code, validation, message, path). Delete the debug file once the real tests pass. Faster than reasoning about schema shapes from memory — Zod's issue output tells you precisely which field failed and why.

## Summary Table

| Pitfall | Diagnostic | Fix |
|---------|-----------|-----|
| `precision: N` rejects JS ISO timestamps | Zod issue `validation: "datetime"` | Remove `precision` or match it to actual input |
| tsdown `.mjs` mismatch | `ls dist/` → no `.mjs` present | Set `exports.import` to `.js` |
| Cross-package import unresolvable | Dep built? In package.json? | `pnpm install` + build dep before consumer tests |
| `write_file` truncation warning | "last read with pagination" guard | Re-read full file (no offset) before write |
| Schema error unclear | Large test file, no signal | Minimal debug test with `console.log(issues)` |
