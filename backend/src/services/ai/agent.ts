import { GoogleGenerativeAI } from '@google/generative-ai';
import { toolsDefinition, toolsImplementation } from './tools';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class HealthAgent {
    private model: any;
    private chat: any;

    constructor() {
        this.model = genAI.getGenerativeModel({
            model: 'gemini-pro',
            tools: [{ functionDeclarations: toolsDefinition }],
        });
        this.chat = this.model.startChat();
    }

    async processQuery(query: string, context: any = {}) {
        try {
            // Send the user's query to the model
            const result = await this.chat.sendMessage(query);
            const response = result.response;
            const call = response.functionCalls();

            if (call && call.length > 0) {
                // Handle function calls
                const functionCall = call[0];
                const { name, args } = functionCall;

                // Execute the tool
                const toolFn = (toolsImplementation as any)[name];
                if (toolFn) {
                    const toolResult = toolFn(args);

                    // Send the tool result back to the model
                    const result2 = await this.chat.sendMessage([{
                        functionResponse: {
                            name: name,
                            response: toolResult
                        }
                    }]);
                    return result2.response.text();
                }
            }

            return response.text();
        } catch (error) {
            console.error('Error processing query:', error);
            // Fallback if something goes wrong (e.g. safety settings)
            return "I'm sorry, I encountered an issue processing that request. Please try again.";
        }
    }

    async analyzeMedicalReport(reportText: string) {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `
      Analyze the following medical report and extract key findings, diagnosis, and recommended actions.
      Report: ${reportText}
    `;
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
}

export const healthAgent = new HealthAgent();
