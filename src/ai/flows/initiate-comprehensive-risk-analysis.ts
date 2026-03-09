
'use server';
/**
 * @fileOverview This file implements the Genkit flow for initiating a comprehensive organizational risk analysis.
 * Processes SRS, BRD, Legal, and Proposal documents.
 * Includes advanced error handling for Rate Limits (429) and Resource Exhaustion.
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
  // Visualization Data for 15 Visuals
  heatmapData: z.array(z.object({ impact: z.number(), probability: z.number(), count: z.number(), label: z.string() })),
  trendData: z.array(z.object({ month: z.string(), current: z.number(), forecast: z.number() })),
  severityDistribution: z.array(z.object({ category: z.string(), Low: z.number(), Medium: z.number(), High: z.number(), Critical: z.number() })),
  mitigationProgress: z.array(z.object({ name: z.string(), progress: z.number() })),
  deptComparison: z.array(z.object({ subject: z.string(), A: z.number(), B: z.number(), fullMark: z.number() })),
  incidentFrequency: z.array(z.object({ day: z.string(), count: z.number() })),
  gapAnalysis: z.object({ current: z.number(), desired: z.number(), gap: z.number() }),
  riskTimeline: z.array(z.object({ time: z.string(), event: z.string(), type: z.string() })),
  riskReduction: z.array(z.object({ name: z.string(), before: z.number(), after: z.number() })),
  bubbleData: z.array(z.object({ x: z.number(), y: z.number(), z: z.number(), name: z.string() })),
  rootCauseData: z.array(z.object({ factor: z.string(), percentage: z.number(), color: z.string() })),
});

export type InitiateComprehensiveRiskAnalysisOutput = z.infer<typeof ComprehensiveRiskAnalysisOutputSchema>;

// --- Combined Orchestration Prompt ---

const comprehensiveRiskAnalysisPrompt = ai.definePrompt({
  name: 'comprehensiveRiskAnalysisPrompt',
  input: { schema: OrganizationalDataInputSchema },
  output: { schema: ComprehensiveRiskAnalysisOutputSchema },
  prompt: `You are the IntelliRisk AI Orchestrator. Perform a deep-vector risk analysis for "{{companyName}}".

Primary Analysis Documents:
- SRS: {{{srsDocument}}}
- BRD: {{{brdDocument}}}
- Legal/Policy: {{{legalPolicyDocument}}}
- Proposal: {{{proposalDocument}}}

Your mission is to find inconsistencies, risks, and anomalies across all 15 vectors.
Generate comprehensive visualization data including:
1. heatmapData: Distribution across impact/probability grid (1-5 scale).
2. trendData: 6 months history + prediction.
3. severityDistribution: Domain-specific severity stacks.
4. mitigationProgress: % completion for key plans.
5. deptComparison: Radar data comparing Finance, Tech, Ops, Compliance, Sales.
6. gapAnalysis: Current state vs target.
7. riskTimeline: Historical detections.
8. incidentFrequency: Daily incident count.
9. riskReduction: Before vs After mitigation values.
10. bubbleData: Impact (x) vs Likelihood (y) with severity (z).
11. rootCauseData: Factors contributing to systemic risk.

Cross-reference documents (e.g., if Proposal violates Legal/SRS).`,
});

/**
 * Helper function for exponential backoff on 429 errors.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 5000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error.message?.includes('429') || 
                        error.message?.includes('RESOURCE_EXHAUSTED') || 
                        error.message?.includes('quota');
    
    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit in Flow. Retrying in ${delay / 1000}s... (Retries left: ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

const initiateComprehensiveRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'initiateComprehensiveRiskAnalysisFlow',
    inputSchema: OrganizationalDataInputSchema,
    outputSchema: ComprehensiveRiskAnalysisOutputSchema,
  },
  async (input) => {
    return withRetry(async () => {
      const { output } = await comprehensiveRiskAnalysisPrompt(input);
      if (!output) throw new Error('Analysis failed to return structured data.');
      return output;
    });
  }
);

export async function initiateComprehensiveRiskAnalysis(
  input: InitiateComprehensiveRiskAnalysisInput
): Promise<InitiateComprehensiveRiskAnalysisOutput> {
  return initiateComprehensiveRiskAnalysisFlow(input);
}
