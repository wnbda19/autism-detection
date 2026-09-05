# Toddler ASD Screening

An Arabic-language web app built with **Streamlit** that uses a pre-trained model (`asd_model.pkl`) for prediction only — **no retraining involved**.

---

## Running the App

### 1) Install dependencies

```bash
pip install -r requirements.txt
```

### 2) Run the app

Make sure the following files are present in the same folder:

- `asd_model.pkl`
- `model_columns.pkl`
- `app.py`

Then run:

```bash
python -m streamlit run app.py
```

The app opens at: `http://localhost:8501`

---

## What the app does

1. Loads the pre-trained model and its columns (`joblib.load`) — **read-only**.
2. Collects 10 behavioral screening questions (Checkbox: Yes=1 / No=0) plus demographic data.
3. Computes the Screening Score, applies `pd.get_dummies`, then aligns columns via `align(join='left', fill_value=0)`.
4. Calls `model.predict()` only and displays: **🔴 ASD indicators present** or **🟢 Typical** — no raw scores or percentages shown.

---

## File structure

```
├── app.py                 # Main interface
├── requirements.txt       # Dependencies
├── README.md
├── asd_model.pkl          # Pre-trained model (read-only — do not modify)
└── model_columns.pkl      # Model columns (read-only — do not modify)
```

> ⚠️ Do **not** retrain the model or modify/delete `asd_model.pkl` or `model_columns.pkl`.
