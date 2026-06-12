import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './styles/theme';

import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider } from './context/JobContext';

import LoginScreen from './screen/LoginScreen';
import SignupScreen from './screen/SignupScreen';
import HomeScreen from './screen/HomeScreen';
import AddJobScreen from './screen/AddJobScreen';
import JobDetailScreen from './screen/JobDetailScreen';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#fff', elevation: 0, shadowOpacity: 0 },
  headerTintColor: '#1A73E8',
  headerTitleStyle: { fontWeight: '700', color: '#1a1a2e' },
  cardStyle: { backgroundColor: '#F3F4F6' },
};

// Auth screens (Login, Signup)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// App screens (Home, AddJob, JobDetail)
const AppStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AddJob" component={AddJobScreen} options={{ title: 'Add Application' }} />
    <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
  </Stack.Navigator>
);

// Decides which stack to show based on login state
const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <JobProvider>
          <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <StatusBar style="dark" />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </View>
        </JobProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}