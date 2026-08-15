# 🎓 College Learning Platform | منصة التعلم الجامعي

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-8E75FF?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 عن المشروع / About the Project

**منصة التعلم الجامعي (College Learning Platform)** هي منصة تعليمية وتطويرية حديثة ومصممة بتقنية **Neo-Brutalist & Modern UI** لإدارة وتنظيم المواد الدراسية، والأسئلة الأكاديمية، والتواصل بين الطلاب وأعضاء الهيئة التدريسية والإداريين.

**College Learning Platform** is a modern, high-performance web platform designed to streamline academic resource management, student subject registration, direct Q&A interaction, and administrative scoping across college levels and departments.

---

## ✨ المميزات الرئيسية / Key Features

### 👨‍🎓 للطلاب / For Students
* 📚 **تصفح المواد الدراسية:** استعراض المحاضرات والملخصات ومقاطع الفيديو والكتب لكل مادة.
* 🎯 **تسجيل المواد الأكاديمية (Subject Selection):** نظام ذكي لاختيار المواد بناءً على المستوى (Level 2, 3, 4, Summer, Case) والتخصص (AI, CS, IS).
* ❓ **منتدى الأسئلة والاستفسارات (Q&A Forum):** طرح أسئلة على المحاضرين والإداريين والحصول على إجابات مباشرة.
* 🔍 **بحث شامل (Global Search):** بحث سريع ومتقدم في جميع المواد والأسئلة.
* 🌓 **وضع ليلي/نهاري (Dark/Light Mode):** مظهر مدروس ومريح للعين مع تصميم Neo-Brutalist عصري.

### 🛡️ للإدارة والأكاديميين / For Admins & Faculty
* 🔑 **صلاحيات مخصصة (Scoped RBAC):**
  * **Super Admin:** صلاحيات كاملة لإدارة المنصة، الطلاب، المناهج، والإداريين.
  * **Level Admin:** إدارة مستوى معين (Level 2, 3, 4, Summer, Case) بما يتضمن المواد والمحتويات والمناقشات.
* 📁 **إدارة المحتوى التعليمي:** إضافة وتحديث وتنظيم الموارد التعليمية (روابط، فيديوهات YouTube، ملفات PDF، كتب).
* 👥 **إدارة الطلاب والحسابات:** تفعيل وتجميد الحسابات، ضبط المستويات الأكاديمية والتخصصات.
* 💬 **الرد على الاستفسارات:** منصة مخصصة لمراجعة والرد على أسئلة الطلاب وحل المشكلات.

---

## 🛠️ التقنيات المستخدمة / Tech Stack

* **Frontend Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom Neo-Brutalist Theme
* **Icons & Animation:** [Lucide React](https://lucide.dev/) + [Framer Motion / Motion](https://motion.dev/)
* **AI Engine:** [Google Gemini API (@google/genai)](https://ai.google.dev/)
* **State Management:** React Context API (`AppContext`)

---

## 📂 الهيكل التنظيمي للمشروع / Project Structure

```text
college-learning-platform/
├── src/
│   ├── components/
│   │   ├── admin/           # لوحات تحكم الإدارة (Materials, Students, Subjects, Management)
│   │   ├── auth/            # صفحات تسجيل الدخول وإنشاء الحساب
│   │   ├── common/          # المكونات المشتركة (Navbar, Search, Notifications, Banner)
│   │   ├── landing/         # الصفحة الرئيسية التعريفية (Landing Page)
│   │   └── student/         # صفحات الطالب (Dashboard, Subjects, Q&A, Profile)
│   ├── context/             # سياق حالة التطبيق (AppContext)
│   ├── data/                # البيانات النموذجية والاختبارية (mockData.ts)
│   ├── types/               # تعريفات أنواع TypeScript (Types & Interfaces)
│   ├── App.tsx              # المكون الرئيسي وموزع الصفحات
│   ├── main.tsx             # نقطة الانطلاق لتطبيق React
│   └── index.css            # أنماط وتنسيقات CSS الأساسية
├── public/                  # الملفات العامة والأيقونات
├── index.html               # الهيكل الأساسي للـ HTML
├── package.json             # ملف التبعيات والسكربتات
├── vite.config.ts           # إعدادات أداة Vite
└── README.md                # دليل الشرح والتطوير
```

---

## 📊 مصفوفة الصلاحيات / Permission Matrix

| الميزة / Feature | Super Admin | Level Admin | Student |
| :--- | :---: | :---: | :---: |
| تصفح المواد والكتب | ✅ | ✅ | ✅ (حسب مستواه) |
| طرح أسئلة واستفسارات | ✅ | ✅ | ✅ |
| الإجابة على أسئلة الطلاب | ✅ | ✅ (ضمن نطاقه) | ❌ |
| إضافة/تعديل المواد الدراسية | ✅ | ✅ (ضمن نطاقه) | ❌ |
| إدارة الحسابات والطلاب | ✅ | 👁️ (عرض فقط) | ❌ |
| تعيين إداريين وتعديل الصلاحيات | ✅ | ❌ | ❌ |

---

## 🚀 التشغيل والتثبيت / Getting Started

### المفهومات والمُتطلبات / Prerequisites
* **Node.js**: v18.0.0 أو أحدث
* **npm**: v9.0.0 أو أحدث

### خطوات التشغيل المحلي / Local Installation Steps

1. **استنساخ المستودع / Clone the repository:**
   ```bash
   git clone https://github.com/your-username/college-learning-platform.git
   cd college-learning-platform
   ```

2. **تثبيت التبعيات / Install dependencies:**
   ```bash
   npm install
   ```

3. **إعداد متغيرات البيئة / Environment Setup:**
   قم بإنشاء ملف `.env.local` في المجلد الرئيسي وإضافة المفاتيح الخاصة بك:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   APP_URL=http://localhost:3000
   ```

4. **تشغيل الخادم المحلي / Run Development Server:**
   ```bash
   npm run dev
   ```
   افتح المتصفح على العنوان: `http://localhost:3000`

---

## 📜 السكربتات المتاحة / Available Scripts

| الأمر / Command | الوصف / Description |
| :--- | :--- |
| `npm run dev` | تشغيل خادم التطوير المحلي مع خاصية HMR |
| `npm run build` | بناء نسخة الإنتاج (Production Build) |
| `npm run preview` | معاينة نسخة الإنتاج محلياً |
| `npm run lint` | فحص الأنواع والأخطاء البرمجية بواسطة TypeScript |
| `npm run clean` | تنظيف المخرجات المؤقتة |

---

## 🤝 المساهمة / Contributing

المساهمات مرحب بها دائماً! إذا كانت لديك أفكار لتحسين المنصة:
1. قم بعمل Fork للمشروع.
2. أنشئ فرعاً جديداً للميزة (`git checkout -b feature/AmazingFeature`).
3. قم بحفظ التغييرات (`git commit -m 'Add some AmazingFeature'`).
4. ارفع الفرع (`git push origin feature/AmazingFeature`).
5. افتح طلب سحب Pull Request.

---

## 📄 الترخيص / License

هذا المشروع مرخص بموجب رخصة **MIT**. راجع ملف [LICENSE](LICENSE) لمزيد من التفاصيل.

<div align="center">
  <sub>صُنِع بحب ❤️ لتسهيل التجربة التعليمية والجامعية</sub>
</div>
