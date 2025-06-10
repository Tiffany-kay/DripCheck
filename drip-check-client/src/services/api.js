// API service for DripCheck
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Helper method for API calls
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // AI Features
  async getDripScore(imageUrl, caption = '') {
    return this.makeRequest('/ai/drip-score', {
      method: 'POST',
      body: JSON.stringify({ imageUrl, caption }),
    });
  }

  async getBattleJudge(outfit1Url, outfit2Url) {
    return this.makeRequest('/ai/battle-judge', {
      method: 'POST',
      body: JSON.stringify({ outfit1Url, outfit2Url }),
    });
  }

  async getStyleTips(imageUrl, description = '') {
    return this.makeRequest('/ai/style-tips', {
      method: 'POST',
      body: JSON.stringify({ imageUrl, description }),
    });
  }

  async generateCaptions(imageUrl, vibe = '') {
    return this.makeRequest('/ai/generate-captions', {
      method: 'POST',
      body: JSON.stringify({ imageUrl, vibe }),
    });
  }

  // Outfit operations
  async createOutfit(outfitData) {
    return this.makeRequest('/outfits', {
      method: 'POST',
      body: JSON.stringify(outfitData),
    });
  }

  async getOutfits() {
    return this.makeRequest('/outfits');
  }

  async getOutfit(id) {
    return this.makeRequest(`/outfits/${id}`);
  }

  async voteOnOutfit(outfitId, isLiked) {
    return this.makeRequest(`/outfits/${outfitId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ isLiked }),
    });
  }

  // Battle operations
  async getActiveBattles() {
    return this.makeRequest('/battles/active');
  }

  async createBattle(outfit1Id, outfit2Id) {
    return this.makeRequest('/battles', {
      method: 'POST',
      body: JSON.stringify({ outfit1Id, outfit2Id }),
    });
  }

  async voteOnBattle(battleId, outfitChoice) {
    return this.makeRequest(`/battles/${battleId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ outfitChoice }),
    });
  }

  async getBattleResults(battleId) {
    return this.makeRequest(`/battles/${battleId}/results`);
  }
}

export default new ApiService();
