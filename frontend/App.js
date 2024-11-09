import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './components/Dashboard'; // Your Dashboard component
import ImportsManagement from './components/ImportsManagement'; // Your Imports Management component
import Analytics from './components/Analytics'; // Your Analytics component
import FloatingMenu from './components/FloatingMenu'; // Your Floating Menu component
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ImportsManagement" component={ImportsManagement} />
          <Stack.Screen name="Analytics" component={Analytics} />
        </Stack.Navigator>

        {/* Floating Menu for navigation */}
        <FloatingMenu />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
