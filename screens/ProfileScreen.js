import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { doc, getDoc } from "firebase/firestore";

export default function UserProfile({ route }) {
    const { userId, userEmail } = route.params;
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState('');

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

                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(userData.name);
                } else {
                    setUserName('');
                }


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

            <Text style={styles.header}>Perfil de {userName}</Text>

            <FlatList
                data={posts}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                numColumns={3}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#dfffdc',
        paddingBottom: 80,
        paddingTop: 80
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
    }
});
