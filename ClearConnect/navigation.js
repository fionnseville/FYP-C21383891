import { Image, ImageBackground, Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import IndexScreen from './screens/index';
import ContactsScreen from './screens/ContactsScreen';
import UserGuideScreen from './screens/UserGuideScreen';
import HelpScreen from './screens/HelpScreen';
import PatientLoginScreen from './screens/Patient_login';
import DoctorLoginScreen from './screens/Doctor_login';
import DashboardScreen from './screens/DoctorDashboardScreen';

import { AuthContext } from './AuthContext'; // Import AuthContext

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
            name="Dashboard"
            component={DashboardScreen}
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
  const { isLoggedIn } = useContext(AuthContext); // Add login state from context

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
        <Tab.Screen
          name="Home_"
          options={{
            tabBarLabel: 'Home',
            iconName: 'home',
          }}
          children={() => <CommonStack component={IndexScreen} title="Home" />}
        />
        {isLoggedIn && (
          <>
            <Tab.Screen
              name="UserGuide_"
              options={{
                tabBarLabel: 'Guide',
                iconName: 'book',
              }}
              children={() => <CommonStack component={UserGuideScreen} title="User Guide" />}
            />
            <Tab.Screen
              name="Contacts_"
              options={{
                tabBarLabel: 'Contact',
                iconName: 'address-book',
              }}
              children={() => <CommonStack component={ContactsScreen} title="Contacts" />}
            />
            <Tab.Screen
              name="Help_"
              options={{
                tabBarLabel: 'Help',
                iconName: 'question-circle',
              }}
              children={() => <CommonStack component={HelpScreen} title="Help" />}
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
