'use server';
/**
 * @fileOverview This file implements the Genkit flow for initiating a comprehensive organizational risk analysis.
 * It processes core business documents (SRS, BRD, Legal, Proposal) alongside operational data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// --- Schemas ---

const RiskItemSchema = z.object({
  name: z.string().describe('Name of the identified risk.'),
  description: z.string().describe('Detailed description of the risk.'),
  probability: z.enum(['Low', 'Medium', 'High']).describe('Predicted probability.'),
  impact: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Potential impact level.'),
  mitigationStrategy: z.string().describe('Proposed strategy to mitigate the risk.'),
  anomalyDetected: z.boolean().describe('Whether this represents a statistical or logical anomaly.'),
  reasoning: z.string().describe('The reasoning behind the identification.'),
});

const AgentOutputSchema = z.object({
  risks: z.array(RiskItemSchema).describe('List of identified risks.'),
  summary: z.string().describe('Agent-specific summary of findings.'),
  overallRiskScore: z.number().min(0).max(100).describe('A numerical score for the risk level (0-100).'),
});

const OrganizationalDataInputSchema = z.object({
  companyName: z.string().describe('The name of the organization.'),
  srsDocument: z.string().describe('Content of the Software Requirements Specification.'),
  brdDocument: z.string().describe('Content of the Business Requirements Document.'),
  legalPolicyDocument: z.string().describe('Content of Company Policies or Legal Frameworks.'),
  proposalDocument: z.string().describe('Content of the Strategic Proposal document.'),
  financialData: z.record(z.string(), z.any()).optional().describe('Financial data.'),
  cybersecurityReports: z.record(z.string(), z.any()).optional().describe('Cybersecurity reports.'),
  operationalMetrics: z.record(z.string(), z.any()).optional().describe('Operational metrics.'),
});

export type InitiateComprehensiveRiskAnalysisInput = z.infer<typeof OrganizationalDataInputSchema>;

const ComprehensiveRiskAnalysisOutputSchema = z.object({
  overallRiskIndex: z.number().min(0).max(100),
  overallRiskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']),
  anomaliesSummary: z.string(),
  globalMitigationStrategies: z.array(z.string()),
  domainAnalysis: z.object({
    financial: AgentOutputSchema,
    cybersecurity: AgentOutputSchema,
    operational: AgentOutputSchema,
    compliance: AgentOutputSchema,
    strategicMarket: AgentOutputSchema,
  }),
  // Visualization Data
  heatmapData: z.array(z.object({ impact: z.number(), probability: z.number(), count: z.number(), label: z.string() })),
  trendData: z.array(z.object({ month: z.string(), current: z.number(), forecast: z.number() })),
  severityDistribution: z.array(z.object({ category: z.string(), Low: z.number(), Medium: z.number(), High: z.number(), Critical: z.number() })),
  mitigationProgress: z.array(z.object({ name: z.string(), progress: z.number() })),
  deptComparison: z.array(z.object({ subject: z.string(), A: z.number(), B: z.number(), fullMark: z.number() })),
  incidentFrequency: z.array(z.object({ day: z.string(), count: z.number() })),
  gapAnalysis: z.object({ current: z.number(), desired: z.number(), gap: z.number() }),
  riskTimeline: z.array(z.object({ time: z.string(), event: z.string(), type: z.string() })),
  riskReduction: z.array(z.object({ name: z.string(), before: z.number(), after: z.number() })),
});

export type InitiateComprehensiveRiskAnalysisOutput = z.infer<typeof ComprehensiveRiskAnalysisOutputSchema>;

// --- Combined Orchestration Prompt ---

const comprehensiveRiskAnalysisPrompt = ai.definePrompt({
  name: 'comprehensiveRiskAnalysisPrompt',
  input: { 
    schema: OrganizationalDataInputSchema.extend({
      financialStr: z.string().optional(),
      cyberStr: z.string().optional(),
      opsStr: z.string().optional(),
    })
  },
  output: { schema: ComprehensiveRiskAnalysisOutputSchema },
  prompt: `You are the IntelliRisk AI Orchestrator. Perform a deep-vector risk analysis for "{{companyName}}".

Primary Analysis Documents:
- SRS: {{{srsDocument}}}
- BRD: {{{brdDocument}}}
- Legal/Policy: {{{legalPolicyDocument}}}
- Proposal: {{{proposalDocument}}}

Operational Context (if available):
- Financial: {{{financialStr}}}
- Cyber: {{{cyberStr}}}
- Operational: {{{opsStr}}}

Your mission is to find inconsistencies, risks, and anomalies.
Generate comprehensive visualization data including:
1. heatmapData: 25 points representing a 5x5 matrix of risk distribution. Each point should have impact (1-5), probability (1-5), count, and label.
2. trendData: Historical (last 6 months) and forecast (next 3 months) risk levels (0-100).
3. severityDistribution: Risks per domain split by severity level.
4. mitigationProgress: Completion percentage for key mitigation plans.
5. deptComparison: Radar data comparing risk across departments (Finance, Tech, Ops, Compliance, Sales).
6. gapAnalysis: Numerical gap between current risk posture and strategic goals (current vs desired vs gap).
7. riskTimeline: Recent detections and projected future review cycles.
8. incidentFrequency: Day-by-day count for the last 14 days.
9. riskReduction: Data comparing risk score 'before' and 'after' proposed mitigations for top 5 risks.

Identify specific risks per domain. Calculate scores. Summarize anomalies. Provide global strategies.`,
});

const initiateComprehensiveRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'initiateComprehensiveRiskAnalysisFlow',
    inputSchema: OrganizationalDataInputSchema,
    outputSchema: ComprehensiveRiskAnalysisOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await comprehensiveRiskAnalysisPrompt({
        ...input,
        financialStr: input.financialData ? JSON.stringify(input.financialData) : "No specific data provided",
        cyberStr: input.cybersecurityReports ? JSON.stringify(input.cybersecurityReports) : "No specific data provided",
        opsStr: input.operationalMetrics ? JSON.stringify(input.operationalMetrics) : "No specific data provided",
      });
      if (!output) throw new Error('Analysis failed to return structured data.');
      return output;
    } catch (error: any) {
      console.error("Analysis Error:", error);
      throw new Error(`Orchestration failed: ${error.message}`);
    }
  }
);

export async function initiateComprehensiveRiskAnalysis(
  input: InitiateComprehensiveRiskAnalysisInput
): Promise<InitiateComprehensiveRiskAnalysisOutput> {
  return initiateComprehensiveRiskAnalysisFlow(input);
}
