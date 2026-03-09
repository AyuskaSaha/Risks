import { InitiateComprehensiveRiskAnalysisInput } from "@/ai/flows/initiate-comprehensive-risk-analysis";

export const mockOrganizationalData: InitiateComprehensiveRiskAnalysisInput = {
  companyName: "Global Horizon Logistics",
  srsDocument: "System shall maintain 99.9% uptime for the automated sorting facility. All financial transactions must be logged in a read-only immutable ledger. Real-time tracking of drone fleet is mandatory.",
  brdDocument: "Increase operational efficiency by 25% by 2026. Expand drone delivery to 5 new urban centers. Reduce debt-to-equity ratio below 0.70.",
  legalPolicyDocument: "Strict adherence to EU AI Act. Data retention limited to 7 years. All vendor pre-payments exceeding $1M require dual-officer sign-off and secondary verification.",
  financialData: {
    revenue_q3: 125000000,
    debt_to_equity: 0.85,
    cash_reserve: 12000000,
    unusual_outflows: [
      { date: "2024-03-12", amount: 1500000, description: "Vendor pre-payment, single-signature only" }
    ],
    projections: { q4_expected: 135000000, market_volatility_impact: "medium" }
  },
  cybersecurityReports: {
    last_audit_date: "2024-01-15",
    vulnerabilities: { critical: 2, high: 8, medium: 45 },
    incidents_last_30_days: [
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
  }
};