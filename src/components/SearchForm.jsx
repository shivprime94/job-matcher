import { useState, useEffect, useRef } from 'react'
import {
  FormControl,
  Input,
  Button,
  HStack,
  FormHelperText,
  Box,
  List,
  ListItem,
  Text,
  useOutsideClick,
  VStack,
  InputGroup,
  InputRightElement,
  Checkbox,
  FormLabel,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { getSkillSuggestions } from '../services/jobService'

function SearchForm({ onSearch, isLoading, fuzzySearch, setFuzzySearch }) {
  const [technology, setTechnology] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const suggestionRef = useRef()

  useOutsideClick({
    ref: suggestionRef,
    handler: () => setShowSuggestions(false),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (technology.trim()) {
      onSearch(technology.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setTechnology(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
  }

  // Debounced suggestion fetching
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (technology.length >= 2) {
        setIsLoadingSuggestions(true)
        try {
          const result = await getSkillSuggestions(technology)
          setSuggestions(result)
        } catch (error) {
          console.error('Error fetching suggestions', error)
        } finally {
          setIsLoadingSuggestions(false)
        }
      } else {
        setSuggestions([])
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [technology])

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl>
          <HStack spacing={4}>
            <Box position="relative" width="100%" ref={suggestionRef}>
              <InputGroup>
                <Input
                  placeholder="Enter a technology (e.g., React, Python, Kubernetes)"
                  value={technology}
                  onChange={(e) => {
                    setTechnology(e.target.value)
                    setShowSuggestions(e.target.value.length >= 2)
                  }}
                  onFocus={() => technology.length >= 2 && setShowSuggestions(true)}
                  size="lg"
                  bg="white"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px blue.400",
                  }}
                />
                <InputRightElement height="100%" width="4.5rem">
                  {isLoadingSuggestions && <Text fontSize="sm">Loading...</Text>}
                </InputRightElement>
              </InputGroup>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <List
                  position="absolute"
                  width="100%"
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  zIndex={10}
                  mt={1}
                  maxH="200px"
                  overflowY="auto"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      p={3}
                      cursor="pointer"
                      _hover={{ bg: "blue.50" }}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            <Button
              leftIcon={<SearchIcon />}
              colorScheme="blue"
              isLoading={isLoading}
              type="submit"
              size="lg"
              px={8}
            >
              Search
            </Button>
          </HStack>
          {/* <FormHelperText>
            Enter any technology, framework, or programming language
          </FormHelperText> */}
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="fuzzy-search" mb="0" fontSize="sm" fontWeight="normal">
            Enable fuzzy search (find similar technology names)
          </FormLabel>
          <Checkbox 
            id="fuzzy-search" 
            isChecked={fuzzySearch} 
            onChange={(e) => setFuzzySearch(e.target.checked)}
            colorScheme="blue"
          />
        </FormControl>
      </VStack>
    </form>
  )
}

export default SearchForm