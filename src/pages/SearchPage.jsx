import { useState, useEffect } from 'react'
import {
  VStack,
  Heading,
  Text,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react'
import SearchForm from '../components/SearchForm'
import ResultsDisplay from '../components/ResultsDisplay'
import { useJobSearch } from '../hooks/useJobSearch'

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const toast = useToast()
  const { 
    data: results, 
    isLoading, 
    error,
    isError,
    failureCount,
    refetch 
  } = useJobSearch(searchTerm)

  const handleSearch = (technology) => {
    setSearchTerm(technology)
  }

  // Show error toast if the API call fails
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch results. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }, [isError, error, toast])

  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} align="center">
        <Heading size="2xl">Job Technology Matcher</Heading>
        <Text color="gray.600" fontSize="lg">
          Find companies using specific technologies in their stack
        </Text>
      </VStack>
      
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      
      {isError && failureCount >= 3 && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <AlertTitle>Failed to fetch results</AlertTitle>
            <AlertDescription>
              {error.message.includes('Authentication') 
                ? 'There was an authentication error. Please check the API configuration.'
                : 'There was an error fetching the results. Please try again later.'}
            </AlertDescription>
          </VStack>
        </Alert>
      )}

      {results?.jobs?.length === 0 && searchTerm && !isLoading && !isError && (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <AlertDescription>
            No jobs found for {searchTerm}. Try searching for a different technology.
          </AlertDescription>
        </Alert>
      )}
      
      <ResultsDisplay results={results} isLoading={isLoading} />
    </VStack>
  )
}

export default SearchPage 