import { ChakraProvider, Box, Container } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SearchPage from './pages/SearchPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Box minH="100vh" bg="gray.50">
          <Container maxW="container.xl" py={8}>
            <SearchPage />
          </Container>
        </Box>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
