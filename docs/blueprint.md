# **App Name**: IntelliRisk AI

## Core Features:

- AI Risk Analysis Engine: Orchestrates 5 specialized AI agents (Financial, Cybersecurity, Operational, Compliance, Strategic/Market) to analyze organizational data in parallel using the Gemini API. The coordinator gathers mock data, triggers agents, and the aggregator combines their structured JSON outputs, utilizing LLM reasoning as a tool to identify anomalies, predict probabilities, and propose mitigation strategies.
- Dynamic Dashboard Risk Overview: Displays an aggregated view of organizational risk through a modern, professional dashboard featuring a Risk Score Gauge, Overall Risk Index, Risk Category Distribution Chart, Probability vs Impact Matrix, Top Detected Risks List, Mitigation Recommendation Panel, Trend Graph, and Anomaly Detection Summary, updating in real-time with AI analysis results.
- Detailed Risk Category Pages: Provides dedicated drill-down pages for each risk category, presenting the specific data monitored, detected anomalies, predicted risk probability, impact assessment, and detailed mitigation recommendations along with the reasoning provided by the individual AI agent responsible for that category.
- Agent Insights & Debug Views: A sidebar navigation section providing individual pages for each of the 5 AI agents, allowing users to inspect the raw AI output, the reasoning chain, detected anomalies, and the full JSON response, crucial for verifying agent operation and understanding their multi-agent architecture.
- AI Risk Copilot Chatbot: An interactive chatbot assistant that leverages the combined outputs of all AI agents to answer user queries, explain dashboard metrics, elaborate on mitigation strategies, and provide summaries of complex risk assessments, utilizing LLM reasoning as a tool.
- Mock Data Management: Generates and manages realistic mock company risk data to enable the system to function independently without requiring external data sources, facilitating demonstrations and initial testing.

## Style Guidelines:

- The chosen color scheme is light, professional, and sophisticated, using a combination of white, black, and golden accents for an enterprise-level analytics platform.
- Primary background color: Clean white (#FFFFFF) for main content areas, providing a crisp and professional canvas.
- Text and dark elements: Deep charcoal black (#1A1A1A) for readability, navigation, and core UI components.
- Accent color: Sophisticated golden (#D4AF37) used for highlights, interactive elements, critical metrics, and branding.
- Secondary accent colors: Subtle light blue (#ADD8E6) and light green (#90EE90) for data visualization elements or to differentiate specific risk categories, used sparingly to maintain sophistication.
- Body and headline font: 'Inter', a grotesque-style sans-serif for its modern, objective, and neutral appearance, ensuring optimal readability across complex data displays and textual explanations.
- Code font: 'Source Code Pro', a monospaced sans-serif, dedicated for displaying raw AI outputs, reasoning chains, and structured JSON, ensuring clear presentation of technical information.
- Utilize a consistent set of professional, minimalist icons with a clean, vector-based style that complements the modern dashboard aesthetic, ensuring clarity for metrics, navigation, and interactive elements.
- Implement a responsive dashboard layout featuring a persistent sidebar for main navigation and agent-specific insights, organized metric cards, and interactive charts, all designed with clean spacing and intuitive information hierarchy for an enterprise feel.
- Incorporate subtle and smooth transitions for data updates on the dashboard, seamless loading states for chart rendering, and gentle feedback animations for user interactions to enhance the professional and dynamic user experience.