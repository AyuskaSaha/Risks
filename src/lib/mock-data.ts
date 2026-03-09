import { InitiateComprehensiveRiskAnalysisInput } from "@/ai/flows/initiate-comprehensive-risk-analysis";

export const mockOrganizationalData: InitiateComprehensiveRiskAnalysisInput = {
  companyName: "Global Horizon Logistics",
  financialData: {
    revenue_q3: 125000000,
    debt_to_equity: 0.85,
    cash_reserve: 12000000,
    unusual_outflows: [
      { date: "2024-03-12", amount: 1500000, description: "Vendor pre-payment, unverified" }
    ],
    projections: { q4_expected: 135000000, market_volatility_impact: "medium" }
  },
  cybersecurityReports: {
    last_audit_date: "2024-01-15",
    vulnerabilities: {
      critical: 2,
      high: 8,
      medium: 45
    },
    incidents_last_30_days: [
      { type: "DDoS attempt", blocked: true, source: "unknown" },
      { type: "Unauthorized access attempt", blocked: true, target: "Financial DB" }
    ],
    access_control: "MFA implemented for 92% of employees"
  },
  operationalMetrics: {
    supply_chain_latency: "14%",
    production_efficiency: 88,
    downtime_hours_month: 42,
    incidents: [
      { location: "Warehouse B", reason: "Equipment failure", downtime: "8 hours" }
    ],
    process_adherence: 94
  },
  complianceDocuments: {
    gdpr_status: "Compliant",
    pending_audits: 1,
    recent_violations: [
      { type: "Data handling policy breach", severity: "Low", date: "2024-02-10" }
    ],
    regulatory_changes: ["New AI transparency act affecting operations in EU"]
  },
  strategicMarketReports: {
    market_share: "18.5%",
    competitor_moves: [
      { competitor: "LogiNext", action: "Acquisition of regional partner" }
    ],
    industry_trends: ["Automation surge", "Green logistics pressure"],
    innovation_pipeline: ["Drone delivery pilot", "Autonomous warehouse bots"]
  }
};
