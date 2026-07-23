"""
Attention Behaviour Model Prototype

This prototype implements a baseline attention behaviour model using reading patterns
and scroll velocity as per VAP evidence types.
"""

import json
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report
from sklearn.isotonic import IsotonicRegression
from sklearn.calibration import calibration_curve
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')


# ─── Synthetic Data Generation ──────────────────────────────────────────────

def generate_attention_data(n_samples=5000, seed=42):
    """Generate synthetic attention vs non-attention sessions."""
    np.random.seed(seed)
    
    data = []
    for _ in range(n_samples):
        # Base session characteristics
        session_duration = np.random.exponential(300)  # seconds, avg 5 min
        session_duration = min(max(session_duration, 10), 3600)  # clamp 10s - 1hr
        
        # Attention class (0 = distracted/bot, 1 = genuine attention)
        is_attentive = np.random.choice([0, 1], p=[0.3, 0.7])
        
        if is_attentive:
            # Genuine attention patterns
            scroll_velocity = np.random.gamma(2, 50)  # pixels/sec, varied
            direction_changes = np.random.poisson(3)
            reading_pauses = np.random.poisson(5)
            pause_durations = np.random.exponential(2, reading_pauses).sum()
            click_count = np.random.poisson(2)
            keypress_count = np.random.poisson(10)
            viewport_visibility = np.random.beta(3, 1)  # skewed high
            visible_duration = session_duration * viewport_visibility
            engagement_score = np.random.beta(4, 1)
        else:
            # Bot/distracted patterns
            scroll_velocity = np.random.exponential(200)  # too fast or too slow
            direction_changes = np.random.poisson(0.5)
            reading_pauses = np.random.poisson(0.5)
            pause_durations = np.random.exponential(0.5, reading_pauses).sum()
            click_count = np.random.poisson(0.2)
            keypress_count = np.random.poisson(1)
            viewport_visibility = np.random.beta(1, 4)  # skewed low
            visible_duration = session_duration * viewport_visibility
            engagement_score = np.random.beta(1, 4)
        
        # E-INTERACTION features
        interaction_duration = session_duration * np.random.uniform(0.3, 0.9)
        avg_scroll_velocity = scroll_velocity
        scroll_direction_changes = direction_changes
        
        # E-VISIBLE features
        visible_duration_ms = visible_duration * 1000
        max_visibility_ratio = viewport_visibility
        avg_visibility_ratio = viewport_visibility * np.random.uniform(0.7, 1.0)
        
        # E-DURATION features
        active_duration_ms = interaction_duration * 1000
        idle_duration_ms = (session_duration - interaction_duration) * 1000
        heartbeat_count = int(session_duration / 5)
        
        # E-CONTEXT features (simplified)
        platform = np.random.choice(['browser', 'mobile', 'desktop'], p=[0.6, 0.3, 0.1])
        
        data.append({
            # E-INTERACTION
            'avg_scroll_velocity': avg_scroll_velocity,
            'scroll_direction_changes': scroll_direction_changes,
            'click_count': click_count,
            'keypress_count': keypress_count,
            'interaction_duration_ms': interaction_duration * 1000,
            'engagement_score': engagement_score,
            
            # E-VISIBLE
            'visible_duration_ms': visible_duration_ms,
            'max_visibility_ratio': max_visibility_ratio,
            'avg_visibility_ratio': avg_visibility_ratio,
            
            # E-DURATION
            'session_duration_ms': session_duration * 1000,
            'active_duration_ms': active_duration_ms,
            'idle_duration_ms': idle_duration_ms,
            'heartbeat_count': heartbeat_count,
            
            # E-CONTEXT
            'platform_browser': 1 if platform == 'browser' else 0,
            'platform_mobile': 1 if platform == 'mobile' else 0,
            'platform_desktop': 1 if platform == 'desktop' else 0,
            
            # Label
            'is_attentive': is_attentive,
        })
    
    return pd.DataFrame(data)


# ─── Model Training ──────────────────────────────────────────────────────────

def train_attention_model(df):
    """Train Random Forest classifier for attention detection."""
    feature_cols = [c for c in df.columns if c != 'is_attentive']
    X = df[feature_cols]
    y = df['is_attentive']
    
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
    
    # Predictions
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    # Metrics
    auc = roc_auc_score(y_test, y_proba)
    
    return model, X_test, y_test, y_pred, y_proba, auc, feature_cols


# ─── Calibration ─────────────────────────────────────────────────────────────

def calibrate_confidence(y_true, y_proba, method='isotonic'):
    """Calibrate predicted probabilities using isotonic regression."""
    ir = IsotonicRegression(out_of_bounds='clip')
    calibrated = ir.fit_transform(y_proba, y_true)
    return calibrated, ir


# ─── Evaluation ──────────────────────────────────────────────────────────────

def evaluate_model(y_true, y_pred, y_proba, feature_names, model):
    """Comprehensive model evaluation."""
    print("=" * 60)
    print("ATTENTION MODEL EVALUATION")
    print("=" * 60)
    
    auc = roc_auc_score(y_true, y_proba)
    print(f"\nROC-AUC: {auc:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=['Distracted/Bot', 'Attentive']))
    
    # Feature importance
    importance = pd.DataFrame({
        'feature': feature_names,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Feature Importances:")
    print(importance.head(10).to_string(index=False))
    
    # Calibration curve
    prob_true, prob_pred = calibration_curve(y_true, y_proba, n_bins=10)
    
    return {
        'auc': auc,
        'feature_importance': importance,
        'calibration_curve': (prob_true, prob_pred)
    }


# ─── Run Pipeline ────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print("Generating synthetic attention data...")
    df = generate_attention_data(10000)
    print(f"Generated {len(df)} samples, {df['is_attentive'].mean():.1%} attentive")
    
    print("\nTraining model...")
    model, X_test, y_test, y_pred, y_proba, auc, features = train_attention_model(df)
    
    print("\nEvaluating...")
    results = evaluate_model(y_test, y_pred, y_proba, features, model)
    
    # Save model artifacts
    import joblib
    joblib.dump(model, 'attention_model.joblib')
    print("\nModel saved to attention_model.joblib")
    
    # Save feature names for inference
    with open('attention_features.json', 'w') as f:
        json.dump(features, f)
    print("Feature list saved to attention_features.json")
    
    # Save evaluation results
    with open('attention_evaluation.json', 'w') as f:
        json.dump({
            'auc': float(results['auc']),
            'feature_importance': results['feature_importance'].to_dict(orient='records'),
            'n_samples': len(df),
            'timestamp': datetime.now().isoformat()
        }, f, indent=2)
    print("Evaluation saved to attention_evaluation.json")
    
    print("\n✓ Attention prototype complete")