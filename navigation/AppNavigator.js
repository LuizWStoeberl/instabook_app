import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PostsScreencs from '../screens/PostsScreens';
import MyProfileScreen from '../screens/MyProfileScreen'
import SelecionarLocal from '../screens/SelecionarLocal';

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/> 
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Posts" component={PostsScreencs} options={{ headerShown: false }}/>
      <Stack.Screen name='myprofile' component={MyProfileScreen} options={{ headerShown: false }}/>
      <Stack.Screen name='SelecionarLocal' component={SelecionarLocal} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}