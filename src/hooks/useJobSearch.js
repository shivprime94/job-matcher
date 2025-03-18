import { useQuery } from '@tanstack/react-query';
import { searchJobsByTechnology } from '../services/jobService';
import { storage } from '../utils/storage';

export const useJobSearch = (technology) => {
  return useQuery({
    queryKey: ['jobs', technology],
    queryFn: () => searchJobsByTechnology(technology),
    enabled: Boolean(technology), // Run query when technology is not empty
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.message.includes('Authentication failed')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });
}; 