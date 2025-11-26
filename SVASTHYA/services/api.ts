import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api'; // Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
// const API_URL = 'http://localhost:3000/api'; // Uncomment for iOS Simulator

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const chatWithAgent = async (query: string, context: any = {}) => {
    try {
        const response = await api.post('/agent/chat', { query, context });
        return response.data.response;
    } catch (error) {
        console.error('Error chatting with agent:', error);
        throw error;
    }
};

export const analyzeReport = async (reportText: string) => {
    try {
        const response = await api.post('/agent/analyze-report', { reportText });
        return response.data.analysis;
    } catch (error) {
        console.error('Error analyzing report:', error);
        throw error;
    }
};

export default api;
