import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const AI_ENGINE_URL = import.meta.env.VITE_AI_ENGINE_URL || 'http://localhost:8000';

// Create axios instance for backend API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for AI engine
const aiApi = axios.create({
  baseURL: AI_ENGINE_URL,
});

// Upload image to backend
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Get image by ID
export const getImage = async (id: string) => {
  const response = await api.get(`/upload/${id}`);
  return response.data;
};

// Delete image
export const deleteImage = async (id: string) => {
  const response = await api.delete(`/upload/${id}`);
  return response.data;
};

// Restore image using AI engine
export const restoreImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await aiApi.post('/restore', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Start processing via API gateway which proxies to AI engine and streams events via SSE
export const startProcessing = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/process', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data; // { jobId }
};

// Colorize image using AI engine
export const colorizeImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await aiApi.post('/colorize', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Enhance image using AI engine
export const enhanceImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await aiApi.post('/enhance', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Auction APIs
export const getAllAuctions = async () => {
  const response = await api.get('/auction');
  return response.data;
};

export const getAuctionById = async (id: string) => {
  const response = await api.get(`/auction/${id}`);
  return response.data;
};

export const createAuction = async (auctionData: {
  title: string;
  description: string;
  imageId: string;
  startingPrice: number;
  endDate: string;
}) => {
  const response = await api.post('/auction', auctionData);
  return response.data;
};

export const placeBid = async (auctionId: string, amount: number, bidderName: string) => {
  const response = await api.post(`/auction/${auctionId}/bid`, { amount, bidderName });
  return response.data;
};

// Health check
export const checkBackendHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const checkAIHealth = async () => {
  const response = await aiApi.get('/health');
  return response.data;
};

export default api;
