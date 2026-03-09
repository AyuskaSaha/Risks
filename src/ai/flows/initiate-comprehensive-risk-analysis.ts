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
- SRS (System Requirements): {{{srsDocument}}}
- BRD (Business Goals): {{{brdDocument}}}
- Legal/Policy (Governance): {{{legalPolicyDocument}}}
- Proposal (Strategic Roadmap): {{{proposalDocument}}}

Operational Context (if available):
- Financial: {{{financialStr}}}
- Cyber: {{{cyberStr}}}
- Operational: {{{opsStr}}}

Your mission is to find inconsistencies, risks, and anomalies between these documents. 
For example: Does the Proposal promise something the SRS can't support? Does the BRD ignore a Legal constraint?

Simulate five specialized agents:
1. Financial: Risk vs budget/projections.
2. Cyber: Technical vulnerabilities vs security requirements.
3. Operational: Delivery feasibility vs resource metrics.
4. Compliance: Operations vs Governance/Legal frameworks.
5. Strategic: Alignment with BRD and Proposal goals.

Identify 2-3 specific risks per domain. Calculate scores. Summarize anomalies. Provide global strategies.`,
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
      if (!output) throw new Error('Analysis failed.');
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