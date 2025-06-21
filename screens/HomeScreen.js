import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native"
import { SafeAreaView, View } from "react-native"
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Image } from "react-native";
import { deleteDoc, doc } from "firebase/firestore";
import * as FileSystem from 'expo-file-system';
import { Alert } from "react-native";
import { signOut } from "firebase/auth";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

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
                    <Text style={styles.label}>Usuário:</Text> {item.userDisplayName || 'Desconhecido'}
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

            <View style={styles.rodape}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Home')
                }}>
                    <FontAwesome6 name="house" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    navigation.navigate('myprofile')
                }}>
                    <Ionicons name="person" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    navigation.navigate('Posts')
                }}>
                    <FontAwesome6 name="circle-plus" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => {
                navigation.navigate('myprofile')
            }}>
                <Text>{auth.currentUser?.displayName}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                signOut(auth)
                
            }} style = { styles.buttonRegister }>
                <Text style={styles.buttonText}>Sair</Text>
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
        paddingBottom: 80,
        paddingTop: 200
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
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: "#ffdddd",
        padding: 8,
        borderRadius: 6,
        alignItems: "center",
    },
    deleteText: {
        color: "#aa0000",
        fontWeight: "bold",
    },
    rodape: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#e0e0e0',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc'
    },
    buttonRegister: {
        padding: 15,
        borderRadius: 15,
        marginVertical: 15,
        backgroundColor: '#437a36',
        borderWidth: 2,
        width: 100,
        height: 50
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold'
    }
})