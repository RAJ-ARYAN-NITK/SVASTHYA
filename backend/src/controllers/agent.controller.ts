import { Request, Response } from 'express';
import { healthAgent } from '../services/ai/agent';

export const chatWithAgent = async (req: Request, res: Response) => {
    try {
        const { query, context } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const response = await healthAgent.processQuery(query, context);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const analyzeReport = async (req: Request, res: Response) => {
    try {
        const { reportText } = req.body;
        if (!reportText) {
            return res.status(400).json({ error: 'Report text is required' });
        }

        const analysis = await healthAgent.analyzeMedicalReport(reportText);
        res.json({ analysis });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
