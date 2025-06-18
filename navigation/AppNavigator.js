import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PostsScreencs from '../screens/PostsScreens';

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} /> 
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Posts" component={PostsScreencs} />
    </Stack.Navigator>
  );
}