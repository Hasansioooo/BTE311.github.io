import axios from 'axios';

// API base URL - Development'ta proxy kullan, production'da direkt API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.football-data.org/v4'
  : '/api';

// API key'i environment variable'dan al veya kullanıcıdan alınacak
const API_KEY = process.env.REACT_APP_FOOTBALL_API_KEY || '';

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Auth-Token': API_KEY,
    'Content-Type': 'application/json',
  },
});

// API servisleri
export const footballApi = {
  // Tüm ligleri getir
  getCompetitions: async () => {
    try {
      console.log('API Base URL:', API_BASE_URL);
      console.log('API Key var mı:', !!API_KEY);
      const response = await apiClient.get('/competitions');
      console.log('API Response Status:', response.status);
      return response.data;
    } catch (error) {
      console.error('Ligler getirilirken hata:', error);
      console.error('Hata detayları:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  // Belirli bir ligi getir
  getCompetition: async (competitionId) => {
    try {
      const response = await apiClient.get(`/competitions/${competitionId}`);
      return response.data;
    } catch (error) {
      console.error('Lig getirilirken hata:', error);
      throw error;
    }
  },

  // Ligdeki tüm maçları getir
  getMatches: async (competitionId, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.status) params.append('status', filters.status);
      
      const queryString = params.toString();
      const url = `/competitions/${competitionId}/matches${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Maçlar getirilirken hata:', error);
      throw error;
    }
  },

  // Belirli bir maçı getir
  getMatch: async (matchId) => {
    try {
      const response = await apiClient.get(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Maç getirilirken hata:', error);
      throw error;
    }
  },

  // Maç detaylarını getir (oyuncular dahil)
  getMatchDetails: async (matchId) => {
    try {
      const response = await apiClient.get(`/matches/${matchId}`, {
        params: {
          // Head2head bilgileri için
        }
      });
      return response.data;
    } catch (error) {
      console.error('Maç detayları getirilirken hata:', error);
      throw error;
    }
  },

  // Takım bilgilerini getir
  getTeam: async (teamId) => {
    try {
      const response = await apiClient.get(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error('Takım getirilirken hata:', error);
      throw error;
    }
  },

  // Takım oyuncularını getir
  getTeamPlayers: async (teamId) => {
    try {
      const response = await apiClient.get(`/teams/${teamId}`);
      return response.data.squad || [];
    } catch (error) {
      console.error('Oyuncular getirilirken hata:', error);
      throw error;
    }
  },
};

export default footballApi;

