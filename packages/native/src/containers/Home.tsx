import * as React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
} from 'react-native'
import { Center, Box, Badge, VStack, Button } from 'native-base'

import { Colors, Header } from 'react-native/Libraries/NewAppScreen'

import { ReportsForm } from '../features/Reports/ReportsForm'

import { useIsUserEmailUniqueQuery } from '../graphql/User/User.generated'
import { useReportsSubmitAbuseMutation } from '../graphql/Reports/Reports.generated'

export const Home = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  const [{ data }] = useIsUserEmailUniqueQuery({
    variables: {
      email: 'dev@companion.studio',
    },
  })

  const [abuseFormData] = useReportsSubmitAbuseMutation({
    variables: {
      report: {
        name: 'Elena',
        email: 'elena@companion.studio',
        description: 'Annoying emails',
        isAbuserPairer: false,
        abuseType: 'SOMETHING_ELSE',
      },
    },
  })

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <Box
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Text>
            current user is unique: {JSON.stringify(data?.userIsEmailUnique)}
          </Text>
        </Box>

        <ReportsForm />

        {/* START ------------------------------------------------------- */}
        <Center>
          <VStack space={4} mx={{ base: 'auto', md: 0 }}>
            <Badge colorScheme="info">New Feature</Badge>
            <Badge colorScheme="coolGray">Old Feature</Badge>
          </VStack>
        </Center>

        <Box alignItems="center">
          <VStack>
            <Badge // bg="red.400"
              colorScheme="danger"
              rounded="full"
              mb={-4}
              mr={-4}
              zIndex={1}
              variant="solid"
              alignSelf="flex-end"
              _text={{
                fontSize: 12,
              }}
            >
              2
            </Badge>
            <Button
              mx={{
                base: 'auto',
                md: 0,
              }}
              p="2"
              bg="cyan.500"
              _text={{
                fontSize: 14,
              }}
            >
              Notifications
            </Button>
          </VStack>
        </Box>
        {/* END ---------------------------------------------------------------------- */}
      </ScrollView>
    </SafeAreaView>
  )
}
