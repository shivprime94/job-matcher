import axios from 'axios';
import { API_CONFIG } from '../config/constants';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: API_CONFIG.THEIRSTACK_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_CONFIG.THEIRSTACK_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const searchJobsByTechnology = async (technology) => {
  const skills = technology.split(',').map(skill => skill.trim());

  console.log(storage.get(technology))

  if (storage.get(technology)){
    return storage.get(technology)
  }
  
  try {
    const response = await api.post('/jobs/search', {
      page: 0,
      limit: 1,
      job_technology_slug_or: skills,
      posted_at_max_age_days: 5
    });

    const results = (response.data.data || []).map(job => ({
      id: job.id,
      company_name: job.company_object.name,
      domain: job.company_object.domain,
      job_title: job.job_title,
      job_link: job.url,
      location: job.short_location,
      posted_date: job.date_posted,
      company_logo: job.company_object.logo,
      company_size: job.company_object.employee_count_range,
      company_industry: job.company_object.industry,
      is_remote: job.remote,
      is_hybrid: job.hybrid,
      salary_range: job.salary_string,
      matching_phrases: job.matching_phrases,
      employment_type: job.employment_statuses?.join(', '),
      description: job.description
    }));

    // CACHE THE RESPONSE
    const formatttedData = {
      jobs: results,
      metadata: response.data.metadata
    }

    storage.set(technology, formatttedData);

    return formatttedData;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}; 