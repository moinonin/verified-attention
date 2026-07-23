"""
Fraud Detection Model Prototype

This prototype implements a baseline fraud detection model for:
- Automation detection (bot traffic)
- Replay attack detection
- Emulator/simulator detection
"""

import json
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report
import warnings
warnings.filterwarnings('ignore')


# ─── Synthetic Data Generation ──────────────────────────────────────────────

def generate_fraud_data(n_samples=5000, seed=42):
    """Generate synthetic legitimate vs fraud sessions."""
    np.random.seed(seed)
    
    data = []
    for _ in range(n_samples):
        session_duration = np.random.exponential(300)
        session_duration = min(max(session_duration, 10), 3600)
        
        is_fraud = np.random.choice([0, 1], p=[0.85, 0.15])
        
        if is_fraud:
            fraud_type = np.random.choice(['automation', 'replay', 'emulator'], p=[0.4, 0.3, 0.3])
            
            if fraud_type == 'automation':
                scroll_velocity = np.random.choice([
                    np.random.exponential(500),  # too fast
                    np.random.exponential(10)     # too slow
                ], p=[0.7, 0.3])
                direction_changes = np.random.poisson(0.1)
                click_count = np.random.poisson(0.1)
                keypress_count = np.random.poisson(0.05)
                mouse_movement = np.random.exponential(0.1)
                viewport_visibility = np.random.beta(1, 5)
                timing_entropy = np.random.beta(1, 5)
                evidence_duplicate = 0
                provenance_hash_match = 0
                device_consistency = 0.99
                sensor_noise = np.random.exponential(0.01)
                
            elif fraud_type == 'replay':
                scroll_velocity = np.random.normal(100, 5)
                direction_changes = np.random.poisson(2)
                click_count = np.random.poisson(3)
                keypress_count = np.random.poisson(5)
                mouse_movement = np.random.normal(50, 2)
                viewport_visibility = np.random.beta(2, 2)
                timing_entropy = np.random.beta(1, 3)
                evidence_duplicate = 1
                provenance_hash_match = 1
                device_consistency = 0.99
                sensor_noise = np.random.exponential(0.01)
                
            else:  # emulator
                scroll_velocity = np.random.exponential(150)
                direction_changes = np.random.poisson(1)
                click_count = np.random.poisson(1)
                keypress_count = np.random.poisson(2)
                mouse_movement = np.random.exponential(5)
                viewport_visibility = np.random.beta(1.5, 3)
                timing_entropy = np.random.beta(1.5, 3)
                evidence_duplicate = 0
                provenance_hash_match = 0
                device_consistency = 0.99
                sensor_noise = np.random.exponential(0.01)
        else:
            scroll_velocity = np.random.gamma(2, 50)
            direction_changes = np.random.poisson(3)
            click_count = np.random.poisson(3)
            keypress_count = np.random.poisson(15)
            mouse_movement = np.random.gamma(2, 30)
            viewport_visibility = np.random.beta(3, 1)
            timing_entropy = np.random.beta(4, 1)
            evidence_duplicate = 0
            provenance_hash_match = 0
            device_consistency = np.random.beta(2, 2)
            sensor_noise = np.random.gamma(2, 0.1)
        
        interaction_duration = session_duration * np.random.uniform(0.2, 0.8)
        avg_scroll_velocity = scroll_velocity
        scroll_direction_changes = direction_changes
        click_interval_cv = np.random.exponential(0.5) if is_fraud else np.random.gamma(2, 0.5)
        
        visible_duration = session_duration * viewport_visibility
        max_visibility_ratio = viewport_visibility
        avg_visibility_ratio = viewport_visibility * np.random.uniform(0.7, 1.0)
        
        active_duration_ms = interaction_duration * 1000
        idle_duration_ms = (session_duration - interaction_duration) * 1000
        heartbeat_count = int(session_duration / 5)
        heartbeat_interval_cv = np.random.exponential(0.3) if is_fraud else np.random.gamma(2, 0.1)
        
        platform = np.random.choice(['browser', 'mobile', 'desktop'], p=[0.6, 0.3, 0.1])
        user_agent_entropy = np.random.beta(3, 1) if not is_fraud else np.random.beta(1, 3)
        
        data.append({
            'avg_scroll_velocity': avg_scroll_velocity,
            'scroll_direction_changes': scroll_direction_changes,
            'click_count': click_count,
            'keypress_count': keypress_count,
            'interaction_duration_ms': interaction_duration * 1000,
            'click_interval_cv': click_interval_cv,
            'mouse_movement_score': mouse_movement,
            'visible_duration_ms': visible_duration * 1000,
            'max_visibility_ratio': max_visibility_ratio,
            'avg_visibility_ratio': avg_visibility_ratio,
            'session_duration_ms': session_duration * 1000,
            'active_duration_ms': active_duration_ms,
            'idle_duration_ms': idle_duration_ms,
            'heartbeat_count': heartbeat_count,
            'heartbeat_interval_cv': heartbeat_interval_cv,
            'platform_browser': 1 if platform == 'browser' else 0,
            'platform_mobile': 1 if platform == 'mobile' else 0,
            'platform_desktop': 1 if platform == 'desktop' else 0,
            'user_agent_entropy': user_agent_entropy,
            'timing_entropy': timing_entropy,
            'evidence_duplicate': evidence_duplicate,
            'provenance_hash_match': provenance_hash_match,
            'device_consistency': device_consistency,
            'sensor_noise': sensor_noise,
            'is_fraud': is_fraud,
        })
    
    return pd.DataFrame(data)


# ─── Model Training ──────────────────────────────────────────────────────────

def train_fraud_model(df):
    """Train Random Forest classifier for fraud detection."""
    feature_cols = [c for c in df.columns if c != 'is_fraud']
    X = df[feature_cols]
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_split=10,
        min_samples_leaf=5,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    auc = roc_auc_score(y_test, y_proba)
    
    return model, X_test, y_test, y_pred, y_proba, auc, feature_cols


# ─── Evaluation ──────────────────────────────────────────────────────────────

def evaluate_model(y_true, y_pred, y_proba, feature_names, model):
    """Comprehensive model evaluation."""
    print("=" * 60)
    print("FRAUD DETECTION MODEL EVALUATION")
    print("=" * 60)
    
    auc = roc_auc_score(y_true, y_proba)
    print(f"\nROC-AUC: {auc:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=['Legitimate', 'Fraud']))
    
    importance = pd.DataFrame({
        'feature': feature_names,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 15 Feature Importances:")
    print(importance.head(15).to_string(index=False))
    
    return {
        'auc': auc,
        'feature_importance': importance,
    }


# ─── Run Pipeline ────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print("Generating synthetic fraud data...")
    df = generate_fraud_data(10000)
    print(f"Generated {len(df)} samples, {df['is_fraud'].mean():.1%} fraud")
    
    print("\nTraining model...")
    model, X_test, y_test, y_pred, y_proba, auc, features = train_fraud_model(df)
    
    print("\nEvaluating...")
    results = evaluate_model(y_test, y_pred, y_proba, features, model)
    
    # Save model artifacts
    import joblib
    joblib.dump(model, 'fraud_model.joblib')
    print("\nModel saved to fraud_model.joblib")
    
    with open('fraud_features.json', 'w') as f:
        json.dump(features, f)
    print("Feature list saved to fraud_features.json")
    
    with open('fraud_evaluation.json', 'w') as f:
        json.dump({
            'auc': float(results['auc']),
            'feature_importance': results['feature_importance'].to_dict(orient='records'),
            'n_samples': len(df),
            'fraud_rate': float(df['is_fraud'].mean()),
            'timestamp': datetime.now().isoformat()
        }, f, indent=2)
    print("Evaluation saved to fraud_evaluation.json")
    
    print("\n✓ Fraud detection prototype complete")