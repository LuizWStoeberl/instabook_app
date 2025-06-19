import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native"
import { SafeAreaView, View } from "react-native"
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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
        async function carregarPosts() {
            try {
                const postsRef = collection(db, 'posts');
                const snapshot = await getDocs(postsRef);

                const lista = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setPosts(lista);
            } catch (error) {
                console.error("Erro ao carregar posts:", error);
            }
        }

        carregarPosts();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.postContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: item.userId, userEmail: item.userEmail })}>
                <Text style={[styles.postText]}>
                    <Text style={styles.label}>Usuário:</Text> {item.userEmail || 'Desconhecido'}
                </Text>
            </TouchableOpacity>
            <Text style={styles.postText}><Text style={styles.label}>Descrição:</Text> {item.descricao}</Text>
            <Text style={styles.postText}><Text style={styles.label}>Localização:</Text> {item.localizacao}</Text>

            {item.imagens?.[0] && (
                <Image source={{ uri: item.imagens[0] }} style={styles.postImage} />
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text>Tela Inicial</Text>

            <View>
                <Text>Email do usuario: {user?.email}</Text>

            </View>

            <TouchableOpacity onPress={() => {
                navigation.navigate('myprofile')
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
    postContainer: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    postText: {
        marginTop: 10,
        fontSize: 16,
    },
    label: {
        fontWeight: 'bold',
    }
})