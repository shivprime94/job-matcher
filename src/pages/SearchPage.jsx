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
  HStack,
  Button,
} from '@chakra-ui/react'
import SearchForm from '../components/SearchForm'
import ResultsDisplay from '../components/ResultsDisplay'
import { useJobSearch } from '../hooks/useJobSearch'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 8
  const toast = useToast()
  const { 
    data: results, 
    isLoading, 
    error,
    isError,
    failureCount,
    refetch,
    isPreviousData
  } = useJobSearch(searchTerm, page, ITEMS_PER_PAGE)

  const handleSearch = (technology) => {
    setSearchTerm(technology)
    setPage(1) // Reset to first page on new search
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

  const pagination = results?.pagination || { currentPage: 1, totalPages: 0 }
  
  const handlePrevPage = () => {
    setPage(old => Math.max(old - 1, 1))
  }

  const handleNextPage = () => {
    if (!isPreviousData && page < pagination.totalPages) {
      setPage(old => old + 1)
    }
  }

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
      
      {/* Pagination Controls */}
      {results?.jobs?.length > 0 && (
        <HStack spacing={4} justifyContent="center" py={4}>
          <Button 
            onClick={handlePrevPage} 
            isDisabled={page === 1} 
            leftIcon={<ChevronLeftIcon />}
            colorScheme="blue"
            variant="outline"
          >
            Previous
          </Button>
          
          <Text>
            Page {pagination.currentPage} of {pagination.totalPages}
          </Text>
          
          <Button 
            onClick={handleNextPage} 
            isDisabled={isPreviousData || page >= pagination.totalPages}
            rightIcon={<ChevronRightIcon />}
            colorScheme="blue"
            variant="outline"
          >
            Next
          </Button>
        </HStack>
      )}
    </VStack>
  )
}

export default SearchPage