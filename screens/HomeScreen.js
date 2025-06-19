import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native"
import { SafeAreaView, View } from "react-native"
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Image } from "react-native";

export default function HomeScreen() {

    const navigation = useNavigation();

    const { user, loadingUser } = useAuth();

    const [email, setEmail] = useState('');
    const [posts, setPosts] = useState([]);

    if (loadingUser) return <ActivityIndicator size="large" />;
    if (!user) return <Text>Faça login</Text>;

    useEffect(() => {
        const postsCollection = collection(db, "posts");

        const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Ordena pelo mais recente
            data.sort((a, b) => b.criadoEm?.seconds - a.criadoEm?.seconds);

            setPosts(data);
        });

        return () => unsubscribe(); // Limpa o listener quando sair da tela
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {item.imagens?.length > 0 && (
                <Image
                    source={{ uri: item.imagens[0] }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
            <View style={styles.cardContent}>
                <Text style={styles.description}>{item.descricao}</Text>
                <Text style={styles.location}>📍 {item.localizacao}</Text>
            </View>
        </View>
    );

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


            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
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
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },

    image: {
        width: "100%",
        height: 200,
    },

    cardContent: {
        padding: 10,
    },

    description: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 5,
    },

    location: {
        fontSize: 14,
        color: "#666",
    },
})