# TSMS — نظام إدارة الاشتراكات التقنية
## جمعية عناية الصحية | Enayah Health Society

React + TypeScript + Vite — v4.0

---

## التشغيل المحلي
```bash
npm install
npm run dev        # http://localhost:3000
```

## البناء والنشر
```bash
npm run build      # dist/
npm run preview    # معاينة البناء
```

## النشر على Vercel
```bash
# يكفي ربط المستودع على vercel.com
# إعدادات البناء موجودة في vercel.json
```

## بيانات الدخول الافتراضية
| المستخدم | كلمة المرور | الدور |
|---|---|---|
| admin | Admin@1234 | مدير النظام |
| khalid.r | Khalid@1234 | مدير القطاع |
| nora.s | Nora@1234 | المشرف |
| faisal.sh | Faisal@1234 | الموظف |
| hind.j | Hind@1234 | المراجع |

## هيكل المشروع
```
src/
├── components/
│   ├── ui/           # Button, Card, Table, StatusPill, SearchInput, KpiCard
│   ├── layout/       # Sidebar, Topbar
│   ├── modals/       # (قيد التطوير)
│   └── charts/       # (قيد التطوير)
├── pages/
│   ├── dashboard/    # DashboardPage ✅
│   ├── subscriptions/# SubscriptionsPage ✅
│   ├── vendors/      # (stub — المرحلة القادمة)
│   ├── renewals/     # (stub)
│   └── ...           # 13 صفحة أخرى
├── store/
│   ├── auth.ts       # Zustand auth store
│   └── ui.ts         # Zustand UI store
├── lib/
│   ├── db.ts         # Database engine (localStorage)
│   ├── seed.ts       # Initial data seeding
│   └── persistence.ts# Export/Import JSON backups
├── types/index.ts    # All TypeScript interfaces
└── utils/
    ├── formatting.ts  # fmtDate, fmtNum, fmt, statusPill
    └── alerts.ts      # Smart alerts engine
```

## قاعدة البيانات
localStorage-backed با25 جدول. قابلة للترحيل إلى PostgreSQL/MySQL.
تصدير/استيراد كامل عبر JSON من شريط الأدوات.

## الصفحات المنفذة بالكامل
- ✅ تسجيل الدخول + RBAC
- ✅ لوحة المعلومات (KPIs + Charts + Alerts)
- ✅ إدارة الاشتراكات (جدول كامل + بحث + تصفية + CSV)
- 🔄 باقي الصفحات (stubs جاهزة للتطوير)

## Incremental Development
كل صفحة stub لها نفس المسار والاسم — استبدل المحتوى بالتدريج.
لا تحتاج لتعديل App.tsx أو routing عند إضافة صفحات جديدة.
