import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { TextInput, Button, Card, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { RootState, AppDispatch } from '../../store/store';
import { login, loginWithBiometric, clearError } from '../../store/slices/authSlice';
import { BiometricService } from '../../services/BiometricService';
import { colors } from '../../theme/colors';
import { PATTERNS } from '../../config/constants';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, biometricEnabled } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    dispatch(clearError());
  }, [dispatch]);

  const checkBiometricAvailability = async () => {
    const availability = await BiometricService.checkAvailability();
    setBiometricAvailable(availability.isAvailable);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!PATTERNS.EMAIL.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricAvailable) {
      Alert.alert('Biometric Not Available', 'Biometric authentication is not available on this device.');
      return;
    }

    try {
      await dispatch(loginWithBiometric()).unwrap();
    } catch (error: any) {
      Alert.alert('Biometric Login Failed', error.message || 'Please try again or use email and password.');
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    Alert.alert('Forgot Password', 'Password reset functionality will be implemented.');
  };

  const handleRegister = () => {
    // Navigate to register screen
    Alert.alert('Register', 'Registration screen navigation will be implemented.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMiddle, colors.gradientEnd]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            {/* Logo and Title */}
            <Animatable.View animation="fadeInUp" delay={300} style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.accent]}
                  style={styles.logoGradient}
                >
                  <Icon name="chart-line" size={50} color={colors.white} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>NebulaX</Text>
              <Text style={styles.subtitle}>Professional Crypto Trading</Text>
            </Animatable.View>

            {/* Login Form */}
            <Animatable.View animation="fadeInUp" delay={600} style={styles.formContainer}>
              <Card style={styles.formCard}>
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.formTitle}>Sign In</Text>
                  
                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <TextInput
                      label="Email"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) validateEmail(text);
                      }}
                      mode="outlined"
                      style={styles.input}
                      theme={{
                        colors: {
                          primary: colors.primary,
                          outline: colors.border,
                        },
                      }}
                      left={<TextInput.Icon icon="email" />}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                    <HelperText type="error" visible={!!emailError}>
                      {emailError}
                    </HelperText>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <TextInput
                      label="Password"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) validatePassword(text);
                      }}
                      mode="outlined"
                      style={styles.input}
                      theme={{
                        colors: {
                          primary: colors.primary,
                          outline: colors.border,
                        },
                      }}
                      left={<TextInput.Icon icon="lock" />}
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off' : 'eye'}
                          onPress={() => setShowPassword(!showPassword)}
                        />
                      }
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                    />
                    <HelperText type="error" visible={!!passwordError}>
                      {passwordError}
                    </HelperText>
                  </View>

                  {/* Error Message */}
                  {error && (
                    <HelperText type="error" visible={!!error} style={styles.errorMessage}>
                      {error}
                    </HelperText>
                  )}

                  {/* Login Button */}
                  <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.loginButton}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                  >
                    Sign In
                  </Button>

                  {/* Biometric Login */}
                  {biometricAvailable && biometricEnabled && (
                    <TouchableOpacity
                      style={styles.biometricButton}
                      onPress={handleBiometricLogin}
                      disabled={isLoading}
                    >
                      <Icon name="fingerprint" size={30} color={colors.primary} />
                      <Text style={styles.biometricText}>Use Biometric</Text>
                    </TouchableOpacity>
                  )}

                  {/* Forgot Password */}
                  <TouchableOpacity
                    style={styles.forgotButton}
                    onPress={handleForgotPassword}
                  >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            </Animatable.View>

            {/* Register Link */}
            <Animatable.View animation="fadeInUp" delay={900} style={styles.registerContainer}>
              <Text style={styles.registerPrompt}>Don't have an account?</Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Animatable.View>

            {/* Features Showcase */}
            <Animatable.View animation="fadeInUp" delay={1200} style={styles.featuresContainer}>
              <View style={styles.feature}>
                <Icon name="shield-check" size={20} color={colors.success} />
                <Text style={styles.featureText}>Bank-level Security</Text>
              </View>
              <View style={styles.feature}>
                <Icon name="chart-trending-up" size={20} color={colors.success} />
                <Text style={styles.featureText}>Advanced Trading</Text>
              </View>
              <View style={styles.feature}>
                <Icon name="account-group" size={20} color={colors.success} />
                <Text style={styles.featureText}>Institutional Grade</Text>
              </View>
            </Animatable.View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  formCard: {
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: colors.surface,
  },
  cardContent: {
    padding: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.background,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginBottom: 10,
  },
  biometricText: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 5,
    fontWeight: '600',
  },
  forgotButton: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  registerPrompt: {
    color: colors.white,
    fontSize: 14,
    marginRight: 5,
  },
  registerLink: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    color: colors.white,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default LoginScreen;