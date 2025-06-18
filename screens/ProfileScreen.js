import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { SafeAreaView, View } from "react-native-web"
import { useAuth } from '../context/AuthContext';
import { useState } from "react";

export default function ProfileScreen() {

    const navigation = useNavigation();

    const { user } = useAuth();

    const [email, setEmail] = useState('');
    const [posts, setPosts] = useState([]);

    return (
        <SafeAreaView style={styles.container}>
            <Text>Tela Inicial</Text>

            <View>
                <Text>Email do usuario: {user?.email}</Text>
            </View>

            <TouchableOpacity onPress={() => {
                navigation.navigate('Home')
            }}>
                <Text>Tela inicial</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
     container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#bdf9ab",
    }
})