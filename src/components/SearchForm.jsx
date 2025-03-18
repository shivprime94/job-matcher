import { useState } from 'react'
import {
  FormControl,
  Input,
  Button,
  HStack,
  FormHelperText,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

function SearchForm({ onSearch, isLoading }) {
  const [technology, setTechnology] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (technology.trim()) {
      onSearch(technology.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <HStack spacing={4}>
          <Input
            placeholder="Enter a technology (e.g., React, Python, Kubernetes)"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            size="lg"
            bg="white"
            _focus={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px blue.400",
            }}
          />
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
        <FormHelperText>
          Enter any technology, framework, or programming language
        </FormHelperText>
      </FormControl>
    </form>
  )
}

export default SearchForm 