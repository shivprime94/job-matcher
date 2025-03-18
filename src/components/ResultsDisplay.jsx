import {
  SimpleGrid,
  Box,
  VStack,
  Text,
  Link,
  Badge,
  Skeleton,
  Image,
  HStack,
  Icon,
  Divider,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaBuilding, FaUsers, FaClock } from 'react-icons/fa'
import { storage } from '../utils/storage'


function formatPostedDate(dateString) {
  if (!dateString) return 'Date not available';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Format the date using Intl.DateTimeFormat
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
}

function JobCard({ job }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cardPadding = useBreakpointValue({ base: 4, md: 6 })
  const logoSize = useBreakpointValue({ base: "40px", md: "50px" })
  const titleSize = useBreakpointValue({ base: "lg", md: "xl" })

  return (
    <>
      <Box
        bg="white"
        p={cardPadding}
        rounded="xl"
        shadow="md"
        borderWidth="1px"
        borderColor="gray.200"
        transition="all 0.3s ease"
        _hover={{
          shadow: 'xl',
          transform: 'translateY(-4px)',
          borderColor: 'blue.200',
        }}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <VStack align="stretch" spacing={4} flex="1">
          <HStack spacing={4} align="start">
            {job.company_logo && (
              <Image
                src={job.company_logo}
                alt={`${job.company_name} logo`}
                boxSize={logoSize}
                objectFit="contain"
                fallback={
                  <Box 
                    w={logoSize} 
                    h={logoSize} 
                    bg="gray.100" 
                    rounded="md" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                  >
                    <Icon as={FaBuilding} color="gray.400" />
                  </Box>
                }
              />
            )}
            <Box flex="1">
              <Text fontSize={titleSize} fontWeight="bold" color="blue.600" noOfLines={2}>
                {job.company_name}
              </Text>
              {/* <Text color="gray.600" fontSize="sm" noOfLines={1}>
                {job.domain}
              </Text> */}
              <Link
              href={job.domain}
              isExternal
              color="blue.500"
              fontSize="sm"
              display="flex"
              alignItems="center"
              _hover={{
                color: 'blue.600',
                textDecoration: 'none'
              }}
            >
              Company page <ExternalLinkIcon mx={1} />
            </Link>
            </Box>
          </HStack>

          <Box>
            <HStack spacing={2} flexWrap="wrap">
              <Badge 
                colorScheme="blue" 
                fontSize="sm"
                p={2}
                whiteSpace="normal"
                textAlign="left"
                lineHeight="1.4"
              >
                {job.job_title}
              </Badge>
              {/* {(job.is_remote || job.is_hybrid) && (
                <Badge 
                  colorScheme="green" 
                  fontSize="sm"
                  p={2}
                >
                  {job.is_remote ? 'Remote' : 'Hybrid'}
                </Badge>
              )} */}
            </HStack>
          </Box>

          <VStack align="stretch" spacing={2}>
            <HStack fontSize="sm" color="gray.600" spacing={2}>
              <Icon as={FaMapMarkerAlt} boxSize="12px" />
              <Text noOfLines={1}>{job.location || 'Location not specified'}</Text>
            </HStack>
            <HStack fontSize="sm" color="gray.600" spacing={2}>
            <Icon as={FaCalendarAlt} boxSize="12px" />
            <Text>Posted: {formatPostedDate(job.posted_date)}</Text>
          </HStack>
            {/* {job.employment_type && (
              <HStack fontSize="sm" color="gray.600" spacing={2}>
                <Icon as={FaBriefcase} boxSize="12px" />
                <Text noOfLines={1}>{job.employment_type}</Text>
              </HStack>
            )} */}
            {/* {job.company_size && (
              <HStack fontSize="sm" color="gray.600" spacing={2}>
                <Icon as={FaUsers} boxSize="12px" />
                <Text noOfLines={1}>Company size: {job.company_size}</Text>
              </HStack>
            )}
            {job.company_industry && (
              <HStack fontSize="sm" color="gray.600" spacing={2}>
                <Icon as={FaBuilding} boxSize="12px" />
                <Text noOfLines={1}>{job.company_industry}</Text>
              </HStack>
            )} */}
          </VStack>

          {/* {job.salary_range && (
            <Text fontSize="sm" color="green.600" fontWeight="semibold" noOfLines={1}>
              {job.salary_range}
            </Text>
          )} */}

          <Divider />

          <HStack justify="space-between" mt="auto" pt={2}>
            {/* <Button 
              size="sm" 
              onClick={onOpen}
              colorScheme="blue"
              variant="outline"
              _hover={{
                bg: 'blue.50'
              }}
            >
              View Details
            </Button> */}
            <Link
              href={job.job_link}
              isExternal
              color="blue.500"
              fontSize="sm"
              display="flex"
              alignItems="center"
              _hover={{
                color: 'blue.600',
                textDecoration: 'none'
              }}
            >
              Apply <ExternalLinkIcon mx={1} />
            </Link>
          </HStack>
        </VStack>
      </Box>

      {/* <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>{job.job_title} at {job.company_name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {job.matching_phrases && job.matching_phrases.length > 0 && (
              <Box mb={4}>
                <Text fontWeight="bold" mb={2}>Matching Technology References:</Text>
                <VStack align="stretch">
                  {job.matching_phrases.map((phrase, index) => (
                    <Text key={index} fontSize="sm" color="gray.600">
                      "{phrase}"
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}
            <Divider my={4} />
            <Text whiteSpace="pre-wrap">{job.description}</Text>
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </>
  )
}

function ResultsDisplay({ results, isLoading }) {
  const gridColumns = useBreakpointValue({ 
    base: 1, 
    sm: 1,
    md: 2, 
    lg: 3, 
    xl: 4 
  })
  
  if (isLoading) {
    return (
      <SimpleGrid columns={gridColumns} spacing={{ base: 4, md: 6 }} px={{ base: 4, md: 0 }}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            bg="white"
            p={{ base: 4, md: 6 }}
            rounded="xl"
            shadow="md"
            borderWidth="1px"
            height="100%"
          >
            <VStack align="stretch" spacing={4}>
              <HStack spacing={4}>
                <Skeleton w={{ base: "40px", md: "50px" }} h={{ base: "40px", md: "50px" }} rounded="md" />
                <Box flex="1">
                  <Skeleton height="24px" width="70%" mb={2} />
                  <Skeleton height="16px" width="40%" />
                </Box>
              </HStack>
              <Skeleton height="20px" width="40%" />
              <VStack align="stretch" spacing={2}>
                <Skeleton height="16px" width="60%" />
                <Skeleton height="16px" width="50%" />
                <Skeleton height="16px" width="70%" />
              </VStack>
              <Skeleton height="20px" width="30%" />
              <HStack justify="space-between" pt={2}>
                <Skeleton height="32px" width="100px" />
                <Skeleton height="20px" width="80px" />
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  if (!results?.jobs?.length) {
    return null;
  }

  return (
    <VStack spacing={6} align="stretch" w="100%" px={{ base: 4, md: 0 }}>
      <SimpleGrid columns={gridColumns} spacing={{ base: 4, md: 6 }}>
        {results.jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </SimpleGrid>
    </VStack>
  )
}

export default ResultsDisplay 