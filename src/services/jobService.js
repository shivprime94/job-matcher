import axios from 'axios';
import { API_CONFIG } from '../config/constants';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const searchJobsByTechnology = async (technology, page = 1, limit = 8, fuzzySearch = true) => {
  // Create a unique cache key that includes pagination params and fuzzy flag
  const cacheKey = `${technology}_page${page}_limit${limit}_fuzzy${fuzzySearch}`;

  if (storage.get(cacheKey)){
    return storage.get(cacheKey);
  }

  console.log(`Fetching jobs for: ${technology}, page: ${page}, limit: ${limit}, fuzzy: ${fuzzySearch}`);
  
  try {
    const response = await api.get(`/job/skill/${technology}`, {
      params: { page, limit, fuzzy: fuzzySearch }
    });
    
    // Check if data exists and has the expected structure
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      return { jobs: [], pagination: { currentPage: page, totalPages: 0, totalItems: 0 } };
    }

    const data = response.data.data;
    const pagination = response.data.pagination || { 
      currentPage: page,
      totalPages: Math.ceil((data.length || 0) / limit),
      totalItems: data.length || 0
    };

    const results = data.map(job => ({
      id: job.id,
      company_logo: job.img,
      job_title: job.title,
      company_name: job.company,
      domain: job.companyUrl,
      job_link: job.url,
      location: job.location,
      posted_date: job.postedDate,
    }));

    // CACHE THE RESPONSE
    const formattedData = {
      jobs: results,
      pagination,
      fuzzyMatch: response.data.fuzzyMatch || null
    };

    storage.set(cacheKey, formattedData);

    return formattedData;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Get skill suggestions for autocomplete
export const getSkillSuggestions = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await api.get('/job/suggestions', {
      params: { q: query }
    });
    
    return response.data.suggestions || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};