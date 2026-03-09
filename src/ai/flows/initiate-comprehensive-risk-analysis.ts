'use server';
/**
 * @fileOverview This file implements the Genkit flow for initiating a comprehensive organizational risk analysis.
 * It uses a single high-fidelity prompt to simulate a multi-agent orchestration to identify anomalies, 
 * predict probabilities, and propose mitigation strategies across all risk domains.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// --- Schemas ---

const RiskItemSchema = z.object({
  name: z.string().describe('Name of the identified risk.'),
  description: z.string().describe('Detailed description of the risk, including specific anomalies detected.'),
  probability: z.enum(['Low', 'Medium', 'High']).describe('Predicted probability of the risk occurring.'),
  impact: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Potential impact if the risk materializes.'),
  mitigationStrategy: z.string().describe('Proposed strategy to mitigate the risk.'),
  anomalyDetected: z.boolean().describe('Whether this risk represents an anomaly in the data.'),
  reasoning: z.string().describe('The reasoning behind the risk identification.'),
});

const AgentOutputSchema = z.object({
  risks: z.array(RiskItemSchema).describe('List of identified risks for this domain.'),
  summary: z.string().describe('Overall summary of risk findings for this domain.'),
  overallRiskScore: z.number().min(0).max(100).describe('A numerical score for the risk level (0-100).'),
});

const OrganizationalDataInputSchema = z.object({
  companyName: z.string().describe('The name of the organization.'),
  financialData: z.record(z.string(), z.any()).describe('Financial data.'),
  cybersecurityReports: z.record(z.string(), z.any()).describe('Cybersecurity reports.'),
  operationalMetrics: z.record(z.string(), z.any()).describe('Operational metrics.'),
  complianceDocuments: z.record(z.string(), z.any()).describe('Compliance documents.'),
  strategicMarketReports: z.record(z.string(), z.any()).describe('Strategic and market reports.'),
});

export type InitiateComprehensiveRiskAnalysisInput = z.infer<typeof OrganizationalDataInputSchema>;

const ComprehensiveRiskAnalysisOutputSchema = z.object({
  overallRiskIndex: z.number().min(0).max(100).describe('Aggregated organizational risk score (0-100).'),
  overallRiskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Categorical representation of overall risk.'),
  anomaliesSummary: z.string().describe('Summary of critical anomalies detected across all domains.'),
  globalMitigationStrategies: z.array(z.string()).describe('High-level mitigation strategies.'),
  domainAnalysis: z.object({
    financial: AgentOutputSchema,
    cybersecurity: AgentOutputSchema,
    operational: AgentOutputSchema,
    compliance: AgentOutputSchema,
    strategicMarket: AgentOutputSchema,
  }).describe('Detailed analysis for each domain.'),
  aggregatedReasoning: z.string().describe('Comprehensive reasoning for the overall assessment.'),
});

export type InitiateComprehensiveRiskAnalysisOutput = z.infer<typeof ComprehensiveRiskAnalysisOutputSchema>;

// --- Combined Orchestration Prompt ---

const comprehensiveRiskAnalysisPrompt = ai.definePrompt({
  name: 'comprehensiveRiskAnalysisPrompt',
  input: { 
    schema: OrganizationalDataInputSchema.extend({
      financialStr: z.string(),
      cyberStr: z.string(),
      opsStr: z.string(),
      compStr: z.string(),
      stratStr: z.string(),
    })
  },
  output: { schema: ComprehensiveRiskAnalysisOutputSchema },
  prompt: `You are the IntelliRisk AI Orchestrator. Your task is to perform a deep-vector risk analysis for "{{companyName}}" by simulating five specialized risk agents:

1. Financial Agent: Analyzes balance sheets, cash flows, and unusual outflows.
2. Cybersecurity Agent: Reviews vulnerability scans and incident logs.
3. Operational Agent: Evaluates supply chain latency and production efficiency.
4. Compliance Agent: Checks policy adherence and regulatory changes.
5. Strategic Agent: Monitors market share and competitor moves.

Organizational Data provided:
- Financial: {{{financialStr}}}
- Cyber: {{{cyberStr}}}
- Operational: {{{opsStr}}}
- Compliance: {{{compStr}}}
- Strategic: {{{stratStr}}}

Please provide a structured, holistic risk profile. For each domain, identify specific risks (at least 2-3), detect anomalies, and calculate a domain-specific risk score. Finally, aggregate these into an overall organizational risk index and global mitigation strategy.`,
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
        financialStr: JSON.stringify(input.financialData),
        cyberStr: JSON.stringify(input.cybersecurityReports),
        opsStr: JSON.stringify(input.operationalMetrics),
        compStr: JSON.stringify(input.complianceDocuments),
        stratStr: JSON.stringify(input.strategicMarketReports),
      });
      if (!output) throw new Error('Analysis failed to generate a response.');
      return output;
    } catch (error: any) {
      console.error("Genkit Flow Error:", error);
      throw new Error(`Risk Agent Orchestration failed: ${error.message || 'Unknown error'}`);
    }
  }
);

export async function initiateComprehensiveRiskAnalysis(
  input: InitiateComprehensiveRiskAnalysisInput
): Promise<InitiateComprehensiveRiskAnalysisOutput> {
  return initiateComprehensiveRiskAnalysisFlow(input);
}
