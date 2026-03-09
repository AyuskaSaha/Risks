'use server';
/**
 * @fileOverview A Genkit flow for reviewing detailed insights from specialized AI agents.
 *
 * - reviewAgentInsights - A function that fetches and returns detailed insights from a specified AI agent.
 * - ReviewAgentInsightsInput - The input type for the reviewAgentInsights function.
 * - ReviewAgentInsightsOutput - The return type for the reviewAgentInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ReviewAgentInsightsInputSchema = z.object({
  agentName: z
    .enum([
      'Financial',
      'Cybersecurity',
      'Operational',
      'Compliance',
      'Strategic/Market',
    ])
    .describe('The name of the specialized AI agent whose insights are requested.'),
  scenarioDescription: z
    .string()
    .describe('A brief description of the scenario or data the agent should analyze.'),
});
export type ReviewAgentInsightsInput = z.infer<typeof ReviewAgentInsightsInputSchema>;

const AgentAnalysisOutputSchema = z.object({
  analysisSummary: z.string().describe("A summary of the agent's analysis."),
  reasoningChain: z
    .array(z.string())
    .describe('A step-by-step breakdown of the agent\u0027s reasoning.'),
  detectedAnomalies: z
    .array(
      z.object({
        description: z.string().describe('Description of the anomaly.'),
        severity: z.enum(['Low', 'Medium', 'High']).describe('Severity of the anomaly.'),
        impact: z.string().describe('Potential impact of the anomaly.'),
      })
    )
    .describe('List of detected anomalies with descriptions, severity, and impact.'),
  predictedProbability: z
    .number()
    .min(0)
    .max(1)
    .describe('Predicted probability of the risk occurring (0 to 1).'),
  impactAssessment: z.string().describe('Detailed assessment of the potential impact of the risk.'),
  mitigationStrategies: z
    .array(z.string())
    .describe('Recommended strategies to mitigate the identified risks.'),
});

const ReviewAgentInsightsOutputSchema = z.object({
  agentName: z.string().describe('The name of the specialized AI agent.'),
  analysisSummary: z.string().describe("A summary of the agent's analysis."),
  reasoningChain: z
    .array(z.string())
    .describe('A step-by-step breakdown of the agent\u0027s reasoning.'),
  detectedAnomalies: z
    .array(
      z.object({
        description: z.string(),
        severity: z.enum(['Low', 'Medium', 'High']),
        impact: z.string(),
      })
    )
    .describe('List of detected anomalies with descriptions, severity, and impact.'),
  predictedProbability: z
    .number()
    .min(0)
    .max(1)
    .describe('Predicted probability of the risk occurring (0 to 1).'),
  impactAssessment: z.string().describe('Detailed assessment of the potential impact of the risk.'),
  mitigationStrategies: z
    .array(z.string())
    .describe('Recommended strategies to mitigate the identified risks.'),
  rawGenAIOutput: AgentAnalysisOutputSchema.passthrough().describe(
    'The raw JSON output from the AI model before final processing, containing all generated fields.'
  ),
});
export type ReviewAgentInsightsOutput = z.infer<typeof ReviewAgentInsightsOutputSchema>;

export async function reviewAgentInsights(
  input: ReviewAgentInsightsInput
): Promise<ReviewAgentInsightsOutput> {
  return reviewAgentInsightsFlow(input);
}

const agentInsightPrompt = ai.definePrompt({
  name: 'agentInsightPrompt',
  input: { schema: ReviewAgentInsightsInputSchema },
  output: { schema: AgentAnalysisOutputSchema },
  prompt: `You are an expert {{agentName}} Risk Analysis AI Agent. Your task is to analyze a given scenario and provide a detailed risk assessment, including identified anomalies, predicted probabilities, potential impacts, and concrete mitigation strategies. Provide a clear reasoning chain for your conclusions.

Scenario for analysis:
{{{scenarioDescription}}}

Generate your output in a structured JSON format, adhering to the following schema:
{{jsonSchema AgentAnalysisOutputSchema}}`,
});

const reviewAgentInsightsFlow = ai.defineFlow(
  {
    name: 'reviewAgentInsightsFlow',
    inputSchema: ReviewAgentInsightsInputSchema,
    outputSchema: ReviewAgentInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await agentInsightPrompt(input);

    if (!output) {
      throw new Error('Agent insight generation failed: No output from AI model.');
    }

    return {
      agentName: input.agentName,
      analysisSummary: output.analysisSummary,
      reasoningChain: output.reasoningChain,
      detectedAnomalies: output.detectedAnomalies,
      predictedProbability: output.predictedProbability,
      impactAssessment: output.impactAssessment,
      mitigationStrategies: output.mitigationStrategies,
      rawGenAIOutput: output, // Store the entire raw output from the prompt
    };
  }
);
