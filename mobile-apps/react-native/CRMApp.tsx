import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CRMDashboard } from './screens/CRMDashboard';
import { CustomerList } from './screens/CustomerList';
import { CustomerProfile } from './screens/CustomerProfile';
import { SalesPipeline } from './screens/SalesPipeline';
import { SupportTickets } from './screens/SupportTickets';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { LoginScreen } from './screens/LoginScreen';
import { CRMService } from './services/CRMService';
import { NotificationService } from './services/NotificationService';
import { AuthService } from './services/AuthService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Customer Stack Navigator
function CustomerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CustomerList" 
        component={CustomerList} 
        options={{ title: 'Customers' }}
      />
      <Stack.Screen 
        name="CustomerProfile" 
        component={CustomerProfile} 
        options={{ title: 'Customer Profile' }}
      />
    </Stack.Navigator>
  );
}

// Main CRM Tab Navigator
function CRMTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Customers') {
            iconName = 'people';
          } else if (route.name === 'Sales') {
            iconName = 'trending-up';
          } else if (route.name === 'Support') {
            iconName = 'support-agent';
          } else if (route.name === 'Analytics') {
            iconName = 'analytics';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderTopColor: '#374151',
          paddingTop: 5,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
        },
        headerStyle: {
          backgroundColor: '#1F2937',
        },
        headerTintColor: '#FFFFFF',
      })}
    >
      <Tab.Screen name="Dashboard" component={CRMDashboard} />
      <Tab.Screen name="Customers" component={CustomerStack} />
      <Tab.Screen name="Sales" component={SalesPipeline} />
      <Tab.Screen name="Support" component={SupportTickets} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function CRMApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    checkAuthStatus();
    initializeServices();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setUserToken(token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeServices = async () => {
    try {
      await NotificationService.initialize();
      await CRMService.initialize();
      
      // Request notification permissions
      const hasPermission = await NotificationService.requestPermission();
      if (!hasPermission) {
        Alert.alert(
          'Notifications Disabled',
          'Enable notifications to receive important CRM updates'
        );
      }
    } catch (error) {
      console.error('Service initialization failed:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(email, password);
      
      if (response.success) {
        await AsyncStorage.setItem('authToken', response.token);
        setUserToken(response.token);
        setIsAuthenticated(true);
        
        // Schedule notification setup
        await NotificationService.scheduleWelcomeNotification();
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setUserToken(null);
      setIsAuthenticated(false);
      await NotificationService.cancelAllNotifications();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading NebulaX CRM...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />
      {isAuthenticated ? (
        <CRMTabs />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export { CRMApp };