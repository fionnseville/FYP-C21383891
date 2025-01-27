import { Image, ImageBackground, Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import IndexScreen from './screens/index';
import ContactsScreen from './screens/messageScreen';
import UserGuideScreen from './screens/HealthMetricScreen';
import HelpScreen from './screens/NotificationScreen';
import PatientLoginScreen from './screens/Patient_login';
import DoctorLoginScreen from './screens/Doctor_login';
import DoctorDashboardScreen from './screens/DoctorDashboardScreen'; 
import ChatScreen from './screens/ChatScreen';
import RegisterScreen from './screens/registry';


import { AuthContext } from './AuthContext'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const { height, width } = Dimensions.get('window');
const baseFontSize = Math.min(width, height) * 0.05;

//common stack
function CommonStack({ component, title }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={title}
        component={component}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/final_cleaned_icon.png')}
              style={{ width: Math.min(baseFontSize * 3), height: Math.min(baseFontSize * 3), resizeMode: 'contain', marginTop: -13 }}
            />
          ),
          headerBackground: () => (
            <Image
              source={require('./assets/background.jpg')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }}
            />
          ),
          headerStyle: {
            height: height * 0.13,
            borderBottomWidth: 2,
            borderBottomColor: '#000',
          },
          headerTintColor: '#f5f5dc',
          headerTitleAlign: 'center',
        }}
      />

      {title === 'Home' && (
        <>
          <Stack.Screen
            name="DoctorLogin"
            component={DoctorLoginScreen}
            options={{
              headerTitle: () => (
                <Image
                  source={require('./assets/final_cleaned_icon.png')}
                  style={{ width: Math.min(baseFontSize * 3), height: Math.min(baseFontSize * 3), resizeMode: 'contain', marginTop: -13 }}
                />
              ),
              headerBackground: () => (
                <Image
                  source={require('./assets/background.jpg')}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
              ),
              headerStyle: {
                height: height * 0.13,
                borderBottomWidth: 2,
                borderBottomColor: '#000',
              },
              headerTintColor: '#f5f5dc',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="PatientLogin"
            component={PatientLoginScreen}
            options={{
              headerTitle: () => (
                <Image
                  source={require('./assets/final_cleaned_icon.png')}
                  style={{ width: Math.min(baseFontSize * 3), height: Math.min(baseFontSize * 3), resizeMode: 'contain', marginTop: -13 }}
                />
              ),
              headerBackground: () => (
                <Image
                  source={require('./assets/background.jpg')}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
              ),
              headerStyle: {
                height: height * 0.13,
                borderBottomWidth: 2,
                borderBottomColor: '#000',
              },
              headerTintColor: '#f5f5dc',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
          name="Register"
          component={RegisterScreen}  
          options={{
            headerTitle: () => (
              <Image
                source={require('./assets/final_cleaned_icon.png')}
                style={{ width: Math.min(baseFontSize * 3), height: Math.min(baseFontSize * 3), resizeMode: 'contain', marginTop: -13 }}
              />
            ),
            headerBackground: () => (
              <Image
                source={require('./assets/background.jpg')}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
            ),
            headerStyle: {
              height: height * 0.13,
              borderBottomWidth: 2,
              borderBottomColor: '#000',
            },
            headerTintColor: '#f5f5dc',
            headerTitleAlign: 'center',
          }}
        />
          <Stack.Screen
            name="Dashboard"
            component={DoctorDashboardScreen}
            options={{
              headerTitle: 'Dashboard',
              headerBackground: () => (
                <Image
                  source={require('./assets/background.jpg')}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
              ),
              headerStyle: {
                height: height * 0.13,
                borderBottomWidth: 2,
                borderBottomColor: '#000',
              },
              headerTintColor: '#f5f5dc',
              headerTitleAlign: 'center',
            }}
          />
          
        </>
      )}

      {title === 'Messages' && (
        <>
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen} 
            options={({ route }) => ({
              title: `Chat with ${route.params.name}`, 
              headerBackground: () => (
                <Image
                  source={require('./assets/background.jpg')}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
              ),
              headerStyle: {
                height: height * 0.13,
                borderBottomWidth: 2,
                borderBottomColor: '#000',
              },
              headerTintColor: '#f5f5dc',
              headerTitleAlign: 'center',
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}


//top bar
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.tabBarBackground}
    >
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabButton}
            >
              <View style={styles.iconAndLabel}>
                <FontAwesome
                  name={options.iconName}
                  size={24}
                  color={isFocused ? '#f5f5dc' : '#a9a9a9'}
                />
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>{label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ImageBackground>
  );
}

//bottom tabs
export default function Navigation() {
  const { isLoggedIn } = useContext(AuthContext); //retrieves loggedin state

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'transparent',
            height: height * 0.1,
          },
          tabBarActiveTintColor: '#f5f5dc',
          tabBarInactiveTintColor: '#a9a9a9',
          headerShown: false, 
        }}
      >
        {/* dynamic home tab */}
        <Tab.Screen
          name="Home_"
          options={{
            tabBarLabel: 'Home',
            iconName: 'home',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" color={color} size={size} />
            ),
          }}
          children={() =>
            <CommonStack
              component={isLoggedIn ? DoctorDashboardScreen : IndexScreen} // switching screen dynamically
              title="Home"
            />
          }
        />
        {/* tabs rendered post login*/}
        {isLoggedIn && (
          <>
            <Tab.Screen
              name="HealthMetrics_"
              options={{
                tabBarLabel: 'Health',
                iconName: 'heartbeat',
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="heartbeat" color={color} size={size} />
                ),
              }}
              children={() => <CommonStack component={UserGuideScreen} title="Health Metrics" />}
            />
            <Tab.Screen
              name="messages_"
              options={{
                tabBarLabel: 'Message',
                iconName: 'envelope',
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="envelope" color={color} size={size} />
                ),
              }}
              children={() => <CommonStack component={ContactsScreen} title="Messages" />}
            />
            <Tab.Screen
              name="Notifications_"
              options={{
                tabBarLabel: 'Alerts',
                iconName: 'bell',
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="bell" color={color} size={size} />
                ),
              }}
              children={() => <CommonStack component={HelpScreen} title="Alerts" />}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  tabBarBackground: {
    width: '100%',
    height: height * 0.1,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAndLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: Math.min(baseFontSize * 1.5, 24),
    color: '#a9a9a9',
    fontWeight: 'bold',
    marginTop: 5,
  },
  tabLabelFocused: {
    color: '#f5f5dc',
  },
});
