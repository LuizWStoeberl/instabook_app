import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import { deleteDoc, doc } from "firebase/firestore";
import { Alert } from "react-native";

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

  const excluirPost = async (post) => {
    try {
      if (post.imagens && post.imagens.length > 0) {
        for (const path of post.imagens) {
          try {
            await FileSystem.deleteAsync(path, { idempotent: true });
          } catch (e) {
            console.warn("Erro ao deletar imagem local:", e);
          }
        }
      }
  
      await deleteDoc(doc(db, "posts", post.id));
  
      if (post.refUserPost) {
        const caminho = post.refUserPost.split("/");
        await deleteDoc(doc(db, caminho[0], caminho[1], caminho[2], caminho[3]));
      }
  
      Alert.alert("Sucesso", "Post excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("Erro", "Não foi possível excluir o post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meu Perfil</Text>
      <Text style={styles.subHeader}>{user?.email}</Text>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            {renderItem({ item })}
            <TouchableOpacity onPress={() => excluirPost(item)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
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
  gridItem: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
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
});
