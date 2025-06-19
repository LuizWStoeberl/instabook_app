import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export default function UserProfile({ route }) {
    const { userId, userEmail } = route.params;
    const [posts, setPosts] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        async function fetchUserPosts() {
            try {
                const postsRef = collection(db, "posts");
                const q = query(postsRef, where("userId", "==", userId));
                const snapshot = await getDocs(q);

                const lista = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setPosts(lista);
            } catch (error) {
                console.error("Erro ao carregar posts do usuário:", error);
            }
        }

        fetchUserPosts();
    }, [userId]);

    const renderItem = ({ item }) => (
        item.imagens?.[0] && (
            <Image
                source={{ uri: item.imagens[0] }}
                style={styles.gridImage}
            />
        )
    );

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.header}>Perfil de {userEmail}</Text>

            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                numColumns={3}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <TouchableOpacity onPress={() => {
                navigation.navigate('Home')
            }}>
                <Text >Voltar </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#dfffdc',
    },
    header: {
        marginTop: 50,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    gridImage: {
        width: Dimensions.get('window').width / 3 - 12,
        height: Dimensions.get('window').width / 3 - 12,
        margin: 5,
        borderRadius: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
});
