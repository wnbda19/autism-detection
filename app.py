"""
واجهة ويب لنموذج فحص التوحد لدى الأطفال (Toddlers ASD Screening)
────────────────────────────────────────────────────────────────
تطبيق Streamlit عربي (RTL) يستدعي النموذج الجاهز asd_model.pkl
للتنبؤ فقط — بدون أي إعادة تدريب أو تعديل على النموذج.
"""

import os

import joblib
import pandas as pd
import streamlit as st

st.set_page_config(
    page_title="فحص التوحد للأطفال | ASD Screening",
    page_icon="🧒",
    layout="centered",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');

html, body, .stApp, [class*="st-"], .stMarkdown, h1, h2, p, span, label {
    font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif !important;
}

.stApp { background: #F5F3EF !important; direction: rtl; }
[data-testid="stHeader"] { background: transparent !important; }
[data-testid="stToolbar"] { display: none !important; }
#MainMenu, footer { visibility: hidden !important; }

.block-container {
    max-width: 720px !important;
    padding-top: 1.5rem !important;
    padding-bottom: 3rem !important;
}

.hero {
    background: linear-gradient(135deg, #5C4FE5 0%, #7c3aed 100%);
    color: #fff;
    padding: 1.75rem 1.5rem;
    border-radius: 1rem;
    text-align: center;
    margin-bottom: 1.25rem;
    box-shadow: 0 8px 24px rgba(92, 79, 229, 0.25);
    direction: rtl;
}
.hero h1 { margin: 0 0 0.4rem 0; font-size: 1.65rem; font-weight: 700; color: #fff !important; }
.hero p { margin: 0; font-size: 0.95rem; opacity: 0.92; color: #fff !important; }

.sec {
    margin: 1.25rem 0 0.75rem 0;
    padding-bottom: 0.45rem;
    border-bottom: 2px solid rgba(92, 79, 229, 0.2);
    font-size: 1.1rem;
    font-weight: 700;
    color: #1E1B30;
    direction: rtl;
    text-align: right;
}

.hint {
    background: #EEE9FF;
    color: #4A3FB0;
    border-radius: 0.75rem;
    padding: 0.7rem 1rem;
    font-size: 0.88rem;
    font-weight: 500;
    margin-bottom: 0.85rem;
    border: 1px solid rgba(92, 79, 229, 0.15);
    direction: rtl;
    text-align: right;
}

.qbox {
    background: #fff;
    border: 1px solid rgba(92, 79, 229, 0.14);
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    direction: rtl;
    text-align: right;
}

div[data-testid="stCheckbox"] { direction: rtl; }
div[data-testid="stCheckbox"] label p {
    font-size: 0.95rem !important;
    font-weight: 600 !important;
    color: #1E1B30 !important;
    line-height: 1.55 !important;
    text-align: right !important;
}

div[data-testid="stNumberInput"] label,
div[data-testid="stSelectbox"] label,
div[data-testid="stRadio"] label {
    direction: rtl !important;
    text-align: right !important;
}

div[data-testid="stFormSubmitButton"] > button {
    background: linear-gradient(135deg, #5C4FE5, #7c3aed) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 0.75rem !important;
    font-size: 1.05rem !important;
    font-weight: 700 !important;
    padding: 0.7rem 1.5rem !important;
    width: 100% !important;
    font-family: 'IBM Plex Sans Arabic', sans-serif !important;
}

.res {
    border-radius: 1rem;
    padding: 1.75rem 1.25rem;
    text-align: center;
    margin: 1rem 0;
    direction: rtl;
}
.res.asd { background: #FEF2F2; border: 1.5px solid #FECACA; }
.res.ok  { background: #ECFDF5; border: 1.5px solid #A7F3D0; }
.res .ico { font-size: 2.4rem; margin-bottom: 0.35rem; }
.res .ttl { font-size: 1.45rem; font-weight: 800; margin: 0; }
.res.asd .ttl { color: #DC2626; }
.res.ok .ttl { color: #059669; }

.disc {
    background: #FFFBEB;
    border: 1px solid #FDE68A;
    border-radius: 0.75rem;
    padding: 0.85rem 1rem;
    color: #92400E;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    direction: rtl;
    margin-top: 0.75rem;
}

.foot {
    text-align: center;
    color: #7069A0;
    font-size: 0.8rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(92, 79, 229, 0.12);
    direction: rtl;
}

hr { margin: 1.1rem 0 !important; border-color: rgba(92,79,229,0.1) !important; }
</style>
""",
    unsafe_allow_html=True,
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


@st.cache_resource
def load_model():
    """تحميل asd_model.pkl و model_columns.pkl — قراءة فقط."""
    model_path = os.path.join(BASE_DIR, "asd_model.pkl")
    cols_path = os.path.join(BASE_DIR, "model_columns.pkl")
    if not os.path.exists(model_path) or not os.path.exists(cols_path):
        st.error("⚠️ لم يتم العثور على ملفات النموذج asd_model.pkl أو model_columns.pkl")
        st.stop()
    model = joblib.load(model_path)
    model_columns = joblib.load(cols_path)
    return model, model_columns


model, model_columns = load_model()

# أسئلة سلوكية A1–A10 بنصوص وصفية مبسطة (Checkbox: نعم=1 / لا=0)
BEHAVIORAL_QUESTIONS = [
    ("A1", "هل ينظر إليك الطفل عندما تناديه باسمه؟"),
    ("A2", "هل يتواصل الطفل معك بصرياً بسهولة (ينظر في عينيك)؟"),
    ("A3", "هل يشير الطفل بإصبعه إلى الأشياء التي يريدها؟"),
    ("A4", "هل يشير الطفل بإصبعه لمشاركتك الاهتمام بشيء ما؟"),
    ("A5", "هل يمارس الطفل اللعب التخيلي (مثل إطعام دمية أو التظاهر بهاتف لعبة)؟"),
    ("A6", "هل يتابع الطفل اتجاه نظرك عندما تنظر إلى شيء ما؟"),
    ("A7", "إذا كان شخص منزعجاً، هل يحاول الطفل مواساته؟"),
    ("A8", "هل كانت الكلمات الأولى للطفل معتادة وطبيعية؟"),
    ("A9", "هل يستخدم الطفل إيماءات بسيطة (مثل التلويح للوداع)؟"),
    ("A10", "هل يحدّق الطفل في الفراغ دون هدف واضح؟"),
]

REGIONS_MAP = {
    "منطقة مكة المكرمة": "Makkah Province",
    "منطقة الرياض": "Riyadh Province",
    "المنطقة الشرقية": "Eastern Province",
    "منطقة المدينة المنورة": "Madinah Province",
    "منطقة عسير": "Aseer Province",
    "منطقة جازان": "Jizan Province",
    "منطقة القصيم": "Qassim Province",
    "منطقة تبوك": "Tabuk Province",
    "منطقة حائل": "Ha'il Province",
    "منطقة نجران": "Najran Province",
    "منطقة الباحة": "Al Baha Province",
    "منطقة الجوف": "Al Jawf Province",
    "منطقة الحدود الشمالية": "Northern Borders Province",
}

GENDER_MAP = {"ذكر": "Male", "أنثى": "Female"}

WHO_MAP = {
    "أحد أفراد العائلة": "Family member",
    "أخصائي رعاية صحية": "Health care professional",
    "آخر": "Other",
}

st.markdown(
    """
<div class="hero">
  <h1>🧒 فحص التوحد لدى الأطفال</h1>
  <p>أداة فحص أولي باستخدام النموذج المُدرَّب مسبقاً — للتنبؤ فقط</p>
</div>
""",
    unsafe_allow_html=True,
)

with st.form("asd_screening_form"):
    st.markdown('<div class="sec">📋 الأسئلة السلوكية</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="hint">ضع علامة ✓ للإجابة بـ «نعم» (= 1)، واتركها فارغة لـ «لا» (= 0)</div>',
        unsafe_allow_html=True,
    )

    answers = {}
    for code, text in BEHAVIORAL_QUESTIONS:
        st.markdown(f'<div class="qbox">{text}</div>', unsafe_allow_html=True)
        checked = st.checkbox("نعم", key=f"chk_{code}")
        answers[code] = 1 if checked else 0

    st.markdown("---")
    st.markdown('<div class="sec">👤 البيانات الديموغرافية</div>', unsafe_allow_html=True)

    c1, c2 = st.columns(2)
    with c1:
        age_months = st.number_input(
            "العمر بالأشهر",
            min_value=1,
            max_value=72,
            value=24,
            step=1,
        )
    with c2:
        gender_ar = st.selectbox("الجنس", options=list(GENDER_MAP.keys()))
        gender_val = GENDER_MAP[gender_ar]

    c3, c4 = st.columns(2)
    with c3:
        region_ar = st.selectbox("المنطقة", options=list(REGIONS_MAP.keys()))
        region_val = REGIONS_MAP[region_ar]
    with c4:
        who_ar = st.selectbox("من يُكمل الاختبار؟", options=list(WHO_MAP.keys()))
        who_val = WHO_MAP[who_ar]

    family_asd_ar = st.radio(
        "هل يوجد تاريخ عائلي لاضطراب طيف التوحد؟",
        options=["لا", "نعم"],
        horizontal=True,
    )
    family_asd_val = "Yes" if family_asd_ar == "نعم" else "No"

    st.markdown("")
    submitted = st.form_submit_button("🔍 تحليل النتيجة")

if submitted:
    # أ) Screening Score = مجموع إجابات A1 إلى A10
    screening_score = sum(answers[code] for code, _ in BEHAVIORAL_QUESTIONS)

    # ب) بناء صف الإدخال بنفس أسماء الحقول المستخدمة وقت التدريب
    input_data = {
        "A10": [answers["A10"]],
        "A9": [answers["A9"]],
        "A8": [answers["A8"]],
        "A7": [answers["A7"]],
        "A6": [answers["A6"]],
        "A5": [answers["A5"]],
        "A4": [answers["A4"]],
        "A3": [answers["A3"]],
        "A2": [answers["A2"]],
        "A1": [answers["A1"]],
        "Region": [region_val],
        "Family member with ASD history": [family_asd_val],
        "Who is completing the test": [who_val],
        "Age": [age_months],
        "Gender": [gender_val],
    }
    df_input = pd.DataFrame(input_data)

    # جـ) One-Hot Encoding بنفس طريقة pd.get_dummies
    df_encoded = pd.get_dummies(df_input)

    # د) مطابقة الأعمدة مع model_columns
    df_model_cols = pd.DataFrame(columns=model_columns)
    df_final, _ = df_encoded.align(df_model_cols, join="left", axis=1, fill_value=0)
    df_final = df_final.reindex(columns=model_columns, fill_value=0)

    # هـ) تنبؤ فقط — بدون predict_proba وبدون عرض أي نسبة
    _ = screening_score
    prediction = model.predict(df_final)[0]

    st.markdown("---")
    st.markdown('<div class="sec">📊 النتيجة</div>', unsafe_allow_html=True)

    if prediction == 1:
        st.markdown(
            '<div class="res asd"><div class="ico">🔴</div>'
            '<p class="ttl">🔴 مؤشرات ASD</p></div>',
            unsafe_allow_html=True,
        )
    else:
        st.markdown(
            '<div class="res ok"><div class="ico">🟢</div>'
            '<p class="ttl">🟢 طبيعي</p></div>',
            unsafe_allow_html=True,
        )

    st.markdown(
        '<div class="disc">⚠️ هذه الأداة للفحص الأولي فقط، وليست بديلاً عن تشخيص طبي متخصص</div>',
        unsafe_allow_html=True,
    )

st.markdown(
    '<div class="foot">فحص التوحد للأطفال — يعمل بالنموذج المُدرَّب مسبقاً (asd_model.pkl)</div>',
    unsafe_allow_html=True,
)
