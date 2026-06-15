// ─────────────────────────────────────────────
//  TSMS — Core Type Definitions v4.0
// ─────────────────────────────────────────────

export interface BaseRecord {
  id: number;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

// Auth
export interface User extends BaseRecord {
  username: string;
  name: string;
  email: string;
  password: string;
  role_id: number;
  dept_id: number | null;
  status: 'نشط' | 'موقوف' | 'معلق';
  avatar: string;
  mfa_enabled: boolean;
  last_login: string;
}
export interface Role extends BaseRecord {
  name: string; name_en: string; level: number; color: string; is_system: boolean;
}
export type PermissionMatrix = Record<number, Record<string, Record<string, 0|1>>>;
export interface CurrentUser extends User { role_name: string; }

// Master Data
export interface Department extends BaseRecord { name: string; description: string; manager: string; budget: number; }
export interface Vendor extends BaseRecord { name: string; country: string; website: string; email: string; phone: string; notes?: string; }
export interface Category extends BaseRecord { name: string; order: number; status: 'نشط'|'غير نشط'; }
export interface SubType extends BaseRecord { name: string; description: string; order: number; status: 'نشط'|'غير نشط'; }
export interface Country extends BaseRecord { name_ar: string; name_en: string; status: 'نشط'|'غير نشط'; }
export interface ContractType extends BaseRecord { name: string; status: 'نشط'|'غير نشط'; }
export interface CancelReason extends BaseRecord { name: string; status: 'نشط'|'غير نشط'; }
export interface OptReason extends BaseRecord { name: string; status: 'نشط'|'غير نشط'; }
export interface AttachType extends BaseRecord { name: string; status: 'نشط'|'غير نشط'; }

// Subscriptions
export type SubStatus = 'نشط'|'ينتهي قريباً'|'منتهي'|'موقوف'|'ملغي';
export type BillingCycle = 'شهري'|'ربع سنوي'|'نصف سنوي'|'سنوي'|'مرة واحدة';
export interface Subscription extends BaseRecord {
  sub_number: string; name: string; type: string; category: string;
  vendor_id: number|null; dept_id: number|null; owner_user_id?: number|null;
  link?: string; start_date?: string; end_date: string;
  billing_cycle: BillingCycle; status: SubStatus; currency: string;
  market_value: number; actual_value: number; discount_pct: number;
  users_licensed: number; users_actual: number;
  auto_renew?: boolean; notes?: string; created_by?: number; cancelled_at?: string;
}
export interface SubscriptionPeriod extends BaseRecord {
  subscription_id: number; period_start: string; period_end: string;
  actual_value: number; market_value: number; discount_pct: number;
  billing_cycle: BillingCycle; renewal_request_id: number|null;
  closed: boolean; notes?: string;
}

// Contracts
export interface Contract extends BaseRecord {
  contract_number: string; name: string; vendor_id: number|null;
  contract_type: string; start_date: string; end_date: string;
  value: number; version: string; notes?: string;
  status: 'نشط'|'منتهي'|'معلق';
}

// Workflow
export type WorkflowStatus = 'مسودة'|'مراجعة تقنية'|'اعتماد مالي'|'معتمد'|'مرفوض';
export interface RenewalRequest extends BaseRecord {
  request_number: string; subscription_id: number; sub_name?: string;
  request_date: string; old_end_date: string; new_end_date: string;
  old_cost: number; new_cost: number; new_market_value?: number;
  status: WorkflowStatus; notes?: string; approved_by?: string; approved_at?: string;
}
export interface RenewalHistory {
  id: number; renewal_id: number; subscription_id: number; action: string;
  old_end: string; new_end: string; old_cost: number; new_cost: number;
  change_pct: number; by: string; at: string;
}
export interface CancellationRequest extends BaseRecord {
  request_number: string; subscription_id: number; sub_name?: string;
  cancel_reason: string; request_date: string; notes?: string;
  status: WorkflowStatus; approved_by?: string; approved_at?: string;
}
export interface CancellationHistory {
  id: number; cancellation_id: number; subscription_id: number;
  action: string; reason: string; by: string; at: string;
}

// Optimization
export interface OptimizationRecord extends BaseRecord {
  subscription_id: number; eligible: 'نعم'|'لا';
  reason: string; expected_saving: number; achieved_saving: number; notes?: string;
}

// Invoices
export type InvoiceStatus = 'معلقة'|'مدفوعة'|'متأخرة'|'ملغاة';
export interface Invoice extends BaseRecord {
  invoice_number: string; subscription_id: number; amount: number; currency: string;
  issue_date: string; due_date: string; paid_date?: string;
  status: InvoiceStatus; notes?: string;
}

// Attachments
export interface Attachment extends BaseRecord {
  entity_type: string; entity_id: number; filename: string;
  size: number; size_label: string; mime_type: string;
  data: string; uploaded_by: string;
}

// Audit
export interface AuditLog {
  id: number; action: string; table_name: string; record_id: number;
  description: string; user: string; created_at: string; deleted: boolean;
  old_values: string|null; new_values: string|null;
}

export interface Notification {
  id: number; subscription_id: number; type: string;
  title: string; message: string; is_read: boolean; created_at: string;
}

// UI
export type NavPanel =
  'dash'|'subs'|'vendors'|'depts'|'invoices'|'reports'|'users'|
  'rbac'|'erd'|'audit'|'contracts'|'renewals'|'cancellations'|
  'optimization'|'calendar'|'masterdata';

export type ModalType =
  'sub'|'vendor'|'dept'|'user'|'invoice'|'contract'|'renewal'|
  'cancellation'|'opt'|'_history'|'_periods'|null;

export interface KPI { label: string; value: string|number; sub?: string; trend?: 'up'|'down'; accent?: string; }
export interface CalendarEvent { date: string; type: 'ev-end'|'ev-renew'|'ev-cancel'|'ev-contract'; label: string; }

// DB Schema
export interface DBSchema {
  subscriptions: Subscription[]; subscription_periods: SubscriptionPeriod[];
  vendors: Vendor[]; departments: Department[]; users: User[]; roles: Role[];
  categories: Category[]; permissions: PermissionMatrix; invoices: Invoice[];
  audit: AuditLog[]; seeded: Array<{v:number;at:string}>;
  contracts: Contract[]; renewals: RenewalRequest[]; cancellations: CancellationRequest[];
  optimization: OptimizationRecord[]; sub_types: SubType[]; countries: Country[];
  contract_types: ContractType[]; cancel_reasons: CancelReason[];
  opt_reasons: OptReason[]; attach_types: AttachType[];
  notifications: Notification[]; attachments: Attachment[];
  renewal_history: RenewalHistory[]; cancellation_history: CancellationHistory[];
}
