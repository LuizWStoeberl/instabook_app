import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import { deleteDoc, doc } from "firebase/firestore";
import { Alert } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import EvilIcons from '@expo/vector-icons/EvilIcons';

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

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            {renderItem({ item })}
            <TouchableOpacity onPress={() => excluirPost(item)} style={styles.deleteButton}>
              <EvilIcons name="trash" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        numColumns={3}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<View style={styles.cabeca}><Text style={styles.header}>{auth.currentUser?.displayName}</Text></View>}
        ListFooterComponent={<View style={{ height: 90 }} />} // para não esconder atrás do rodapé
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfffdc',
    marginTop: 50
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
    width: 115,
    height: 115,
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
    position: 'relative'
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: "#ffdddd",
    borderRadius: 15,
  },
  deleteText: {
    alignSelf: 'center'
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
  cabeca: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#dfffdc', // opcional
    marginBottom: 10
  }

});
