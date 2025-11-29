import axios from 'axios';

import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'
    : 'http://localhost:3000/api';

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

export const register = async (userData: any) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const login = async (userData: any) => {
    try {
        const response = await api.post('/auth/login', userData);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const googleLogin = async (token: string) => {
    try {
        const response = await api.post('/auth/google', { token });
        return response.data;
    } catch (error) {
        console.error('Error logging in with Google:', error);
        throw error;
    }
};

export const syncUser = async (userData: { name: string; email: string; googleId: string }) => {
    try {
        const response = await api.post('/auth/sync', userData);
        return response.data;
    } catch (error) {
        console.error('Error syncing user:', error);
        throw error;
    }
};

export default api;
