/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NativeBaseProvider } from 'native-base'
import { Provider } from 'urql'

import { client } from '../graphql/client'

import { Home } from './Home'
import { ReportsForm } from '../features/Reports/ReportsForm'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <Provider value={client}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="home">
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="reports" component={ReportsForm} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  )
}

export default App
