export type UserRole = "investor" | "agent" | "admin";

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  referral_code?: string;
  created_at: string;
}

export type ProjectStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "active"
  | "completed"
  | "rejected"
  | "cancelled";

export type ProjectPhase = "purchase" | "renovation" | "sale" | "completed";

export interface Project {
  id: number;
  title: string;
  description?: string;
  location?: string;
  address?: string;
  purchase_price?: number;
  renovation_cost?: number;
  total_investment?: number;
  expected_sale_price?: number;
  roi_optimistic?: number;
  roi_realistic?: number;
  roi_pessimistic?: number;
  status: ProjectStatus;
  current_phase: ProjectPhase;
  images: string[];
  floor_plans: string[];
  documents: string[];
  agent_id: number;
  created_at: string;
  updated_at?: string;
  total_raised?: number;
  remaining_amount?: number | null;
}

export interface Investment {
  id: number;
  investor_id: number;
  project_id: number;
  amount: number;
  ownership_percentage?: number;
  status: string;
  expected_return?: number;
  actual_return?: number;
  return_paid: boolean;
  created_at: string;
  paid_at?: string;
}

export interface InvestmentSummary {
  total_invested: number;
  total_expected_return: number;
  total_actual_return: number;
  number_of_investments: number;
  average_roi?: number;
}
