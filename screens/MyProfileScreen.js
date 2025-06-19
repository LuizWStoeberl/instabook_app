import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export default function MyProfileScreen() {
  const [posts, setPosts] = useState([]);
  const user = auth.currentUser;

const navigation = useNavigation();

  useEffect(() => {
    if (!user) return;

    async function fetchMyPosts() {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPosts(lista);
      } catch (error) {
        console.error("Erro ao carregar seus posts:", error);
      }
    }

    fetchMyPosts();
  }, [user]);

  const renderItem = ({ item }) => (
    item.imagens?.[0] && (
      <Image
        source={{ uri: item.imagens[0] }}
        style={styles.gridImage}
      />
    )
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meu Perfil</Text>
      <Text style={styles.subHeader}>{user?.email}</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0fff0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
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
