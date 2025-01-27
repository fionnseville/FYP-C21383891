import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseconfig';  
import { useNavigation } from '@react-navigation/native';
import { sha256 } from 'js-sha256';  
import { AuthContext } from '../AuthContext';  // Import authentication context

export default function Patient_login() {
  const { setIsLoggedIn } = useContext(AuthContext);  // Restore authentication state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (email && password) {
      try {
        // converts to lower case
        const trimmedEmail = email.trim().toLowerCase();
        
        // queries store for email
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where("email", "==", trimmedEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert('Login Failed', 'Invalid email or password');
          return;
        }

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          
          // password is hashed to reduce risk in event of data leak
          const hashedPassword = sha256(password);

          //console.log("Entered hashed password:", hashedPassword);
          //console.log("Stored password hash:", userData.passhash);

          if (userData.passhash === hashedPassword) {
            Alert.alert('Login Successful', `Welcome, ${userData.firstname} ${userData.surname}!`);
            
            // sets authentication state
            setIsLoggedIn(true);

            // resets navigation route on successful login and updates nav bar
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
          } else {
            Alert.alert('Login Failed', 'Incorrect password');
          }
        });

      } catch (error) {
        console.error("Error fetching user:", error);
        Alert.alert('Error', 'Something went wrong');
      }
    } else {
      Alert.alert('Error', 'Please enter both email and password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Patient Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5dc',
    borderColor: '#000',
    borderWidth: 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
  },
  input: {
    width: '80%',
    height: 50,
    padding: 10,
    marginVertical: 10,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#f5f5dc',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
