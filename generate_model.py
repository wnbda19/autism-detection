"""
سكريبت لتوليد ملفات النموذج (asd_model.pkl و model_columns.pkl)
من بيانات التدريب الأصلية، بنفس طريقة الـ notebook.
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# ── تحميل البيانات ──────────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__),
    "Autism Spectrum Disorder Screening Data for Toddlers in Saudi Arabia Data Set.csv")

df = pd.read_csv(DATA_PATH)

# ── إعداد البيانات (نفس الخطوات في الـ notebook) ────────────
X = df.drop("Class", axis=1)
y = df["Class"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# حذف Screening Score (يُحسب يدوياً في التطبيق)
X_train = X_train.drop("Screening Score", axis=1)
X_test  = X_test.drop("Screening Score", axis=1)

# One-Hot Encoding
X_train = pd.get_dummies(X_train)
X_test  = pd.get_dummies(X_test)

# محاذاة الأعمدة
X_train, X_test = X_train.align(X_test, join="left", axis=1, fill_value=0)

# ── تدريب النموذج ──────────────────────────────────────────
model = RandomForestClassifier(random_state=42, class_weight="balanced")
model.fit(X_train, y_train)

# ── حفظ النموذج وأسماء الأعمدة ────────────────────────────
OUT_DIR = os.path.dirname(__file__)
joblib.dump(model, os.path.join(OUT_DIR, "asd_model.pkl"))
joblib.dump(list(X_train.columns), os.path.join(OUT_DIR, "model_columns.pkl"))

print("[OK] asd_model.pkl and model_columns.pkl saved successfully")
print(f"   Columns count: {len(X_train.columns)}")
print(f"   Columns: {list(X_train.columns)}")
