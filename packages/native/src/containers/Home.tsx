import * as React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
} from 'react-native'
import { Box } from 'native-base'

import { Colors, Header } from 'react-native/Libraries/NewAppScreen'

import { useGetCurrentUserQuery } from '../graphql/User/User.generated'

export const Home = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  const [{ data }] = useGetCurrentUserQuery()

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
          <Text>current user: {data?.currentUser?.id}</Text>
        </Box>
      </ScrollView>
    </SafeAreaView>
  )
}
