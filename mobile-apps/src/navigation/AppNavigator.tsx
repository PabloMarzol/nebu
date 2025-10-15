import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

import { RootState } from '../store/store';
import { colors } from '../theme/colors';

// Authentication Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import BiometricSetupScreen from '../screens/auth/BiometricSetupScreen';
import PinSetupScreen from '../screens/auth/PinSetupScreen';
import TwoFactorScreen from '../screens/auth/TwoFactorScreen';

// Main App Screens
import HomeScreen from '../screens/main/HomeScreen';
import TradingScreen from '../screens/trading/TradingScreen';
import PortfolioScreen from '../screens/portfolio/PortfolioScreen';
import MarketsScreen from '../screens/markets/MarketsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Trading Screens
import OrderBookScreen from '../screens/trading/OrderBookScreen';
import ChartScreen from '../screens/trading/ChartScreen';
import OrderHistoryScreen from '../screens/trading/OrderHistoryScreen';
import AdvancedTradingScreen from '../screens/trading/AdvancedTradingScreen';

// Portfolio Screens
import WalletScreen from '../screens/portfolio/WalletScreen';
import StakingScreen from '../screens/portfolio/StakingScreen';
import TransactionHistoryScreen from '../screens/portfolio/TransactionHistoryScreen';
import PortfolioAnalyticsScreen from '../screens/portfolio/PortfolioAnalyticsScreen';

// Market Screens
import MarketDetailScreen from '../screens/markets/MarketDetailScreen';
import PriceAlertsScreen from '../screens/markets/PriceAlertsScreen';
import NewsScreen from '../screens/markets/NewsScreen';

// Additional Screens
import P2PScreen from '../screens/p2p/P2PScreen';
import OTCScreen from '../screens/otc/OTCScreen';
import CopyTradingScreen from '../screens/copytrading/CopyTradingScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import SecurityScreen from '../screens/settings/SecurityScreen';
import NotificationsScreen from '../screens/settings/NotificationsScreen';
import KYCScreen from '../screens/kyc/KYCScreen';
import SupportScreen from '../screens/support/SupportScreen';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  BiometricSetup: undefined;
  PinSetup: undefined;
  TwoFactor: undefined;
  OrderBook: { symbol: string };
  Chart: { symbol: string };
  OrderHistory: undefined;
  AdvancedTrading: { symbol?: string };
  Wallet: undefined;
  Staking: undefined;
  TransactionHistory: undefined;
  PortfolioAnalytics: undefined;
  MarketDetail: { symbol: string };
  PriceAlerts: undefined;
  News: undefined;
  P2P: undefined;
  OTC: undefined;
  CopyTrading: undefined;
  Settings: undefined;
  Security: undefined;
  Notifications: undefined;
  KYC: undefined;
  Support: undefined;
};

export type TabParamList = {
  Home: undefined;
  Trading: undefined;
  Portfolio: undefined;
  Markets: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Trading':
              iconName = focused ? 'chart-line' : 'chart-line-variant';
              break;
            case 'Portfolio':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Markets':
              iconName = focused ? 'trending-up' : 'trending-neutral';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trading" component={TradingScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Markets" component={MarketsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!isAuthenticated ? (
        // Authentication Stack
        <>
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="BiometricSetup" 
            component={BiometricSetupScreen} 
            options={{ title: 'Biometric Setup' }}
          />
          <Stack.Screen 
            name="PinSetup" 
            component={PinSetupScreen} 
            options={{ title: 'PIN Setup' }}
          />
          <Stack.Screen 
            name="TwoFactor" 
            component={TwoFactorScreen} 
            options={{ title: 'Two-Factor Authentication' }}
          />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen 
            name="Main" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="OrderBook" 
            component={OrderBookScreen} 
            options={({ route }) => ({ title: `${route.params.symbol} Order Book` })}
          />
          <Stack.Screen 
            name="Chart" 
            component={ChartScreen} 
            options={({ route }) => ({ title: `${route.params.symbol} Chart` })}
          />
          <Stack.Screen 
            name="OrderHistory" 
            component={OrderHistoryScreen} 
            options={{ title: 'Order History' }}
          />
          <Stack.Screen 
            name="AdvancedTrading" 
            component={AdvancedTradingScreen} 
            options={{ title: 'Advanced Trading' }}
          />
          <Stack.Screen 
            name="Wallet" 
            component={WalletScreen} 
            options={{ title: 'Wallet' }}
          />
          <Stack.Screen 
            name="Staking" 
            component={StakingScreen} 
            options={{ title: 'Staking' }}
          />
          <Stack.Screen 
            name="TransactionHistory" 
            component={TransactionHistoryScreen} 
            options={{ title: 'Transaction History' }}
          />
          <Stack.Screen 
            name="PortfolioAnalytics" 
            component={PortfolioAnalyticsScreen} 
            options={{ title: 'Portfolio Analytics' }}
          />
          <Stack.Screen 
            name="MarketDetail" 
            component={MarketDetailScreen} 
            options={({ route }) => ({ title: route.params.symbol })}
          />
          <Stack.Screen 
            name="PriceAlerts" 
            component={PriceAlertsScreen} 
            options={{ title: 'Price Alerts' }}
          />
          <Stack.Screen 
            name="News" 
            component={NewsScreen} 
            options={{ title: 'Crypto News' }}
          />
          <Stack.Screen 
            name="P2P" 
            component={P2PScreen} 
            options={{ title: 'P2P Trading' }}
          />
          <Stack.Screen 
            name="OTC" 
            component={OTCScreen} 
            options={{ title: 'OTC Desk' }}
          />
          <Stack.Screen 
            name="CopyTrading" 
            component={CopyTradingScreen} 
            options={{ title: 'Copy Trading' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }}
          />
          <Stack.Screen 
            name="Security" 
            component={SecurityScreen} 
            options={{ title: 'Security' }}
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen} 
            options={{ title: 'Notifications' }}
          />
          <Stack.Screen 
            name="KYC" 
            component={KYCScreen} 
            options={{ title: 'KYC Verification' }}
          />
          <Stack.Screen 
            name="Support" 
            component={SupportScreen} 
            options={{ title: 'Support' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;