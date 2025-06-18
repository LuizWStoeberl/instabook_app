import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native"
import { SafeAreaView, View } from "react-native-web"
import { useAuth } from '../context/AuthContext';
import { useState } from "react";

export default function HomeScreen() {

    const navigation = useNavigation();

    const { user, loadingUser } = useAuth();

    const [email, setEmail] = useState('');
    const [posts, setPosts] = useState([]);

    if (loadingUser) return <ActivityIndicator size="large" />;
    if (!user) return <Text>Faça login</Text>;

    return (
        <SafeAreaView style={styles.container}>
            <Text>Tela Inicial</Text>

            <View>
                <Text>Email do usuario: {user?.email}</Text>
               
            </View>

            <TouchableOpacity onPress={() => {
                navigation.navigate('Profile')
            }}>
                <Text>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                navigation.navigate('Posts')
            }}>
                <Text>Criar Posts</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#bdf9ab",
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})