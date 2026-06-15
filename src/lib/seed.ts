// ─────────────────────────────────────────────
//  TSMS — Database Seed (non-destructive)
// ─────────────────────────────────────────────
import { DB, ts, addAudit } from './db'

export function seed(): void {
  const seeded = DB.get('seeded')
  if (seeded[0]?.v >= 7 && DB.query('users').length > 0) return

  // Roles
  if (!DB.query('roles').length) {
    DB.set('roles', [
      { id:1, name:'مدير النظام',    name_en:'System Admin',    level:1, color:'#A63228', is_system:true, deleted:false, created_at:ts(), updated_at:ts() },
      { id:2, name:'مدير القطاع',    name_en:'Sector Manager',  level:2, color:'#BA7517', is_system:true, deleted:false, created_at:ts(), updated_at:ts() },
      { id:3, name:'المشرف',         name_en:'Supervisor',      level:3, color:'#1B6B5A', is_system:true, deleted:false, created_at:ts(), updated_at:ts() },
      { id:4, name:'الموظف',         name_en:'Employee',        level:4, color:'#185FA5', is_system:true, deleted:false, created_at:ts(), updated_at:ts() },
      { id:5, name:'المراجع',        name_en:'Reviewer',        level:5, color:'#534AB7', is_system:true, deleted:false, created_at:ts(), updated_at:ts() },
      { id:6, name:'المدقق',         name_en:'Auditor',         level:6, color:'#6B7280', is_system:true, deleted:false, created_at:ts(), updated_at:ts() },
    ])
  }

  // Departments
  if (!DB.query('departments').length) {
    DB.set('departments', [
      { id:1, name:'إدارة تقنية المعلومات', description:'البنية التحتية والأنظمة', manager:'محمد العمري',   budget:500000, deleted:false, created_at:ts(), updated_at:ts() },
      { id:2, name:'الإدارة العامة',         description:'الإشراف والتوجيه',        manager:'خالد الرشيدي', budget:300000, deleted:false, created_at:ts(), updated_at:ts() },
      { id:3, name:'إدارة التسويق',          description:'التسويق الرقمي',          manager:'نورة السعيد',  budget:200000, deleted:false, created_at:ts(), updated_at:ts() },
      { id:4, name:'الموارد البشرية',        description:'شؤون الموظفين',           manager:'فيصل الشمري', budget:150000, deleted:false, created_at:ts(), updated_at:ts() },
      { id:5, name:'الشؤون المالية',         description:'المالية والمحاسبة',       manager:'هند الجابري',  budget:250000, deleted:false, created_at:ts(), updated_at:ts() },
    ])
  }

  // Users
  if (!DB.query('users').length) {
    DB.set('users', [
      { id:1, username:'admin',     name:'محمد العمري',  email:'admin@enayah.sa',   password:'Admin@1234',  role_id:1, dept_id:1, status:'نشط', avatar:'م.ع', mfa_enabled:false, last_login:'', deleted:false, created_at:ts(), updated_at:ts() },
      { id:2, username:'khalid.r',  name:'خالد الرشيدي', email:'khalid@enayah.sa',  password:'Khalid@1234', role_id:2, dept_id:2, status:'نشط', avatar:'خ.ر', mfa_enabled:false, last_login:'', deleted:false, created_at:ts(), updated_at:ts() },
      { id:3, username:'nora.s',    name:'نورة السعيد',  email:'nora@enayah.sa',    password:'Nora@1234',   role_id:3, dept_id:3, status:'نشط', avatar:'ن.س', mfa_enabled:false, last_login:'', deleted:false, created_at:ts(), updated_at:ts() },
      { id:4, username:'faisal.sh', name:'فيصل الشمري', email:'faisal@enayah.sa',  password:'Faisal@1234', role_id:4, dept_id:4, status:'نشط', avatar:'ف.ش', mfa_enabled:false, last_login:'', deleted:false, created_at:ts(), updated_at:ts() },
      { id:5, username:'hind.j',    name:'هند الجابري',  email:'hind@enayah.sa',    password:'Hind@1234',   role_id:5, dept_id:5, status:'نشط', avatar:'ه.ج', mfa_enabled:false, last_login:'', deleted:false, created_at:ts(), updated_at:ts() },
    ])
  }

  // Vendors
  if (!DB.query('vendors').length) {
    DB.set('vendors', [
      { id:1, name:'Microsoft',    country:'الولايات المتحدة', website:'https://microsoft.com',   email:'support@microsoft.com',  phone:'+1-800-642-7676', deleted:false, created_at:ts(), updated_at:ts() },
      { id:2, name:'Amazon AWS',   country:'الولايات المتحدة', website:'https://aws.amazon.com',  email:'aws-support@amazon.com', phone:'+1-800-090-6266', deleted:false, created_at:ts(), updated_at:ts() },
      { id:3, name:'Google Cloud', country:'الولايات المتحدة', website:'https://cloud.google.com', email:'support@google.com',    phone:'+1-844-613-7589', deleted:false, created_at:ts(), updated_at:ts() },
      { id:4, name:'Adobe',        country:'الولايات المتحدة', website:'https://adobe.com',        email:'support@adobe.com',     phone:'+1-800-833-6687', deleted:false, created_at:ts(), updated_at:ts() },
      { id:5, name:'OpenAI',       country:'الولايات المتحدة', website:'https://openai.com',       email:'enterprise@openai.com', phone:'',                deleted:false, created_at:ts(), updated_at:ts() },
      { id:6, name:'Zoom',         country:'الولايات المتحدة', website:'https://zoom.us',          email:'support@zoom.us',       phone:'+1-888-799-9666', deleted:false, created_at:ts(), updated_at:ts() },
      { id:7, name:'Salesforce',   country:'الولايات المتحدة', website:'https://salesforce.com',   email:'support@salesforce.com',phone:'',                deleted:false, created_at:ts(), updated_at:ts() },
      { id:8, name:'GitHub',       country:'الولايات المتحدة', website:'https://github.com',       email:'support@github.com',    phone:'',                deleted:false, created_at:ts(), updated_at:ts() },
    ])
  }

  // Subscriptions
  if (!DB.query('subscriptions').length) {
    DB.set('subscriptions', [
      { id:1, sub_number:'SUB-0001', name:'Microsoft 365 E3',    type:'SaaS — برمجيات كخدمة', category:'أنظمة مؤسسية',   vendor_id:1, dept_id:1, end_date:'2025-09-09', billing_cycle:'سنوي',  status:'نشط', currency:'SAR', market_value:55000,  actual_value:48000,  discount_pct:12.7, users_licensed:150, users_actual:132, deleted:false, created_at:ts(), updated_at:ts() },
      { id:2, sub_number:'SUB-0002', name:'AWS Cloud Services',  type:'IaaS — بنية تحتية',     category:'خدمات سحابية',   vendor_id:2, dept_id:1, end_date:'2025-10-24', billing_cycle:'شهري',  status:'نشط', currency:'SAR', market_value:120000, actual_value:104000, discount_pct:13.3, users_licensed:0,   users_actual:0,   deleted:false, created_at:ts(), updated_at:ts() },
      { id:3, sub_number:'SUB-0003', name:'ChatGPT Enterprise',  type:'SaaS — برمجيات كخدمة', category:'ذكاء اصطناعي',   vendor_id:5, dept_id:1, end_date:'2025-12-15', billing_cycle:'سنوي',  status:'نشط', currency:'SAR', market_value:70000,  actual_value:62000,  discount_pct:11.4, users_licensed:50,  users_actual:45,  deleted:false, created_at:ts(), updated_at:ts() },
      { id:4, sub_number:'SUB-0004', name:'Adobe Creative Cloud',type:'SaaS — برمجيات كخدمة', category:'تصميم وإبداع',   vendor_id:4, dept_id:3, end_date:'2025-08-13', billing_cycle:'سنوي',  status:'نشط', currency:'SAR', market_value:48000,  actual_value:41000,  discount_pct:14.6, users_licensed:20,  users_actual:18,  deleted:false, created_at:ts(), updated_at:ts() },
      { id:5, sub_number:'SUB-0005', name:'Google Workspace',    type:'SaaS — برمجيات كخدمة', category:'تواصل وتعاون',   vendor_id:3, dept_id:2, end_date:'2026-03-01', billing_cycle:'سنوي',  status:'نشط', currency:'SAR', market_value:75000,  actual_value:67000,  discount_pct:10.7, users_licensed:200, users_actual:187, deleted:false, created_at:ts(), updated_at:ts() },
      { id:6, sub_number:'SUB-0006', name:'Zoom Business',       type:'SaaS — برمجيات كخدمة', category:'تواصل وتعاون',   vendor_id:6, dept_id:2, end_date:'2025-09-30', billing_cycle:'سنوي',  status:'نشط', currency:'SAR', market_value:22000,  actual_value:18500,  discount_pct:15.9, users_licensed:100, users_actual:78,  deleted:false, created_at:ts(), updated_at:ts() },
      { id:7, sub_number:'SUB-0007', name:'GitHub Enterprise',   type:'SaaS — برمجيات كخدمة', category:'تطوير وبرمجة',   vendor_id:8, dept_id:1, end_date:'2025-12-01', billing_cycle:'سنوي',  status:'نشط', currency:'SAR', market_value:32000,  actual_value:28500,  discount_pct:10.9, users_licensed:30,  users_actual:28,  deleted:false, created_at:ts(), updated_at:ts() },
      { id:8, sub_number:'SUB-0008', name:'Salesforce CRM',      type:'SaaS — برمجيات كخدمة', category:'أنظمة مؤسسية',   vendor_id:7, dept_id:2, end_date:'2026-02-01', billing_cycle:'سنوي',  status:'نشط', currency:'SAR', market_value:35000,  actual_value:29000,  discount_pct:17.1, users_licensed:40,  users_actual:35,  deleted:false, created_at:ts(), updated_at:ts() },
    ])
  }

  // Master data tables
  const masterTables: Array<[string, string[]]> = [
    ['sub_types', ['SaaS — برمجيات كخدمة','IaaS — بنية تحتية','PaaS — منصة كخدمة','ترخيص برنامج','استضافة','نطاق ودومين']],
    ['categories', ['ذكاء اصطناعي','خدمات سحابية','استضافة','تصميم وإبداع','أنظمة مؤسسية','أمن معلومات','تواصل وتعاون','تطوير وبرمجة']],
    ['contract_types', ['عقد خدمات','عقد ترخيص','اتفاقية مستوى الخدمة','عقد صيانة','عقد استشارات']],
    ['cancel_reasons', ['انتهاء الحاجة','تكلفة مرتفعة','بديل أفضل','دمج الخدمات','انتهاء المشروع','قرار إداري']],
    ['opt_reasons', ['استخدام منخفض','تكرار مع خدمة أخرى','نسخة مدفوعة غير ضرورية','عدد مستخدمين زائد']],
    ['attach_types', ['عقد','فاتورة','عرض سعر','خطاب رسمي','موافقة','مستند داعم']],
  ]
  masterTables.forEach(([table, names]) => {
    if (!DB.query(table as keyof typeof DB).length) {
      DB.set(table as keyof typeof DB, names.map((n, i) => ({
        id: i+1, name: n, description: '', order: i+1,
        status: 'نشط', deleted: false, created_at: ts(), updated_at: ts()
      })) as never)
    }
  })

  // Countries
  if (!DB.query('countries').length) {
    DB.set('countries', [
      ['الولايات المتحدة','United States'],['المملكة العربية السعودية','Saudi Arabia'],
      ['الإمارات','UAE'],['المملكة المتحدة','United Kingdom'],['ألمانيا','Germany'],
    ].map(([ar, en], i) => ({ id:i+1, name_ar:ar, name_en:en, status:'نشط', deleted:false, created_at:ts(), updated_at:ts() })))
  }

  // Permissions matrix
  if (!Object.keys(DB.get('permissions') as object).length) {
    const screens = ['الاشتراكات','الموردون','الإدارات','المستخدمون','التقارير','الصلاحيات','الإعدادات','الفواتير']
    const actions = ['قراءة','إضافة','تعديل','حذف','اعتماد','تصدير']
    type M = Record<string, number[]>
    const matrix: Record<number, M> = {
      1: { الاشتراكات:[1,1,1,1,1,1], الموردون:[1,1,1,1,1,1], الإدارات:[1,1,1,1,1,1], المستخدمون:[1,1,1,1,1,1], التقارير:[1,1,1,1,1,1], الصلاحيات:[1,1,1,1,1,1], الإعدادات:[1,1,1,1,1,1], الفواتير:[1,1,1,1,1,1] },
      2: { الاشتراكات:[1,1,1,0,1,1], الموردون:[1,1,1,0,0,1], الإدارات:[1,0,1,0,0,1], المستخدمون:[1,1,1,0,0,1], التقارير:[1,0,0,0,0,1], الصلاحيات:[1,0,0,0,0,0], الإعدادات:[1,0,1,0,0,0], الفواتير:[1,1,1,0,1,1] },
      3: { الاشتراكات:[1,1,1,0,0,1], الموردون:[1,1,0,0,0,1], الإدارات:[1,0,0,0,0,1], المستخدمون:[1,0,0,0,0,0], التقارير:[1,0,0,0,0,1], الصلاحيات:[0,0,0,0,0,0], الإعدادات:[0,0,0,0,0,0], الفواتير:[1,1,1,0,0,1] },
      4: { الاشتراكات:[1,0,0,0,0,0], الموردون:[1,0,0,0,0,0], الإدارات:[1,0,0,0,0,0], المستخدمون:[0,0,0,0,0,0], التقارير:[1,0,0,0,0,0], الصلاحيات:[0,0,0,0,0,0], الإعدادات:[0,0,0,0,0,0], الفواتير:[1,0,0,0,0,0] },
      5: { الاشتراكات:[1,0,0,0,0,1], الموردون:[1,0,0,0,0,1], الإدارات:[1,0,0,0,0,1], المستخدمون:[1,0,0,0,0,0], التقارير:[1,0,0,0,0,1], الصلاحيات:[1,0,0,0,0,0], الإعدادات:[0,0,0,0,0,0], الفواتير:[1,0,0,0,0,1] },
      6: { الاشتراكات:[1,0,0,0,0,1], الموردون:[1,0,0,0,0,1], الإدارات:[1,0,0,0,0,1], المستخدمون:[1,0,0,0,0,0], التقارير:[1,0,0,0,1,1], الصلاحيات:[1,0,0,0,0,0], الإعدادات:[0,0,0,0,0,0], الفواتير:[1,0,0,0,1,1] },
    }
    const perms: Record<number, Record<string, Record<string, 0|1>>> = {}
    for (const [rid, smap] of Object.entries(matrix)) {
      perms[Number(rid)] = {}
      for (const sc of screens) {
        perms[Number(rid)][sc] = {}
        actions.forEach((a, i) => { perms[Number(rid)][sc][a] = ((smap[sc]?.[i] ?? 0) as 0|1) })
      }
    }
    DB.set('permissions', perms)
  }

  // Sample contracts
  if (!DB.query('contracts').length) {
    DB.set('contracts', [
      { id:1, contract_number:'CTR-0001', name:'عقد Microsoft 365', vendor_id:1, contract_type:'عقد ترخيص', start_date:'2024-06-01', end_date:'2026-06-01', value:96000, version:'1.0', notes:'', status:'نشط', deleted:false, created_at:ts(), updated_at:ts() },
    ])
  }

  // Initial subscription periods
  if (!DB.query('subscription_periods').length) {
    DB.query('subscriptions').forEach((s, i) => {
      const endParts = (s.end_date ?? '').split('-')
      const startDate = endParts.length === 3
        ? `${parseInt(endParts[0])-1}-${endParts[1]}-${endParts[2]}`
        : ''
      const periods = DB.get('subscription_periods')
      periods.push({
        id: i+1, subscription_id: s.id, period_start: startDate, period_end: s.end_date,
        actual_value: s.actual_value, market_value: s.market_value, discount_pct: s.discount_pct,
        billing_cycle: s.billing_cycle, renewal_request_id: null, closed: false,
        notes: 'الدورة الأولى — ترحيل تلقائي', deleted: false, created_at: ts(), updated_at: ts()
      })
      DB.set('subscription_periods', periods)
    })
  }

  // Optimization records
  if (!DB.query('optimization').length) {
    DB.query('subscriptions').forEach((s, i) => {
      const eligible = s.users_licensed > 0 && s.users_actual / s.users_licensed < 0.75
      const opts = DB.get('optimization')
      opts.push({
        id: i+1, subscription_id: s.id, eligible: eligible ? 'نعم' : 'لا',
        reason: eligible ? 'استخدام منخفض' : '', expected_saving: eligible ? Math.round(s.actual_value * 0.2) : 0,
        achieved_saving: 0, notes: '', deleted: false, created_at: ts(), updated_at: ts()
      })
      DB.set('optimization', opts)
    })
  }

  addAudit('تهيئة', 'system', 0, 'تهيئة قاعدة البيانات — TSMS v4.0 React')
  DB.set('seeded', [{ v: 7, at: ts() }])
}
