import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import MatchesScreen from './screens/MatchesScreen';
import MatchDetailScreen from './screens/MatchDetailScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1A472A',
            },
            headerTintColor: '#FFD700',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerShadowVisible: true,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              title: '⚽ Futbol Merkezi',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen 
            name="Matches" 
            component={MatchesScreen} 
            options={{ 
              title: '🏟️ Maçlar',
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen 
            name="MatchDetail" 
            component={MatchDetailScreen} 
            options={{ 
              title: '📊 Maç Detayı',
              headerTitleAlign: 'center',
            }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100vh',
    backgroundColor: '#111111',
  },
});

export default App;
