import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '../assets/New-Xure-Logo.png'; 

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Validation Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await axios.post(
        'https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/LoginXpert',
        {
          version_number: '2.2.6',
          Username: username,
          Password: password,
          app_name: 'xtore',
        }
      );

      const userData = response.data.XpertData?.[0];

      if (userData && userData.token) {
        Alert.alert('Login Successful', `Welcome, ${userData.firstname} ${userData.lastname}!`);
        navigation.navigate('Xchange', {
          token: userData.token,
          user: userData,
        });
      } else {
        Alert.alert('Login Failed', 'Invalid login credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.flexOne}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Sign In</Text>

          <TextInput
            style={styles.input}
            placeholder="Email address or username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            onFocus={() => setUsernameTouched(true)}
            onBlur={() => setUsernameTouched(true)}
          />
          {usernameTouched && username === '' && (
            <Text style={styles.errorText}>Username is required</Text>
          )}

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordTouched(true)}
              onBlur={() => setPasswordTouched(true)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {passwordTouched && password === '' && (
            <Text style={styles.errorText}>Password is required</Text>
          )}

          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => {}}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>


      <View style={styles.bottomContainer}>
        <Text style={styles.dont}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => {}} style={styles.createAccountButton}>
          <Text style={styles.createAccountText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  flexOne: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  logo: {
    width: 180,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },input: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    paddingVertical: 0,
    borderRadius: 8,
    marginBottom: 5,
    borderWidth: 1.5,
    borderColor: '#333',
    color: '#000',
  },
  passwordContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#333',
    marginBottom: 5,
    marginTop: 10, 
  },
  passwordInput: {
    flex: 1,
    color: '#000',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: '#800080',
    paddingVertical: 12,
    borderRadius: 40,
    marginTop: 10,
    width: '100%',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#e6b570',
    fontWeight: 'bold',
    textDecorationLine: 'none',
    fontSize: 16,
    marginTop: -30,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  dont: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  createAccountButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#e6b570',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    width: '100%',
  },
  createAccountText: {
    color: '#e6b570',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
