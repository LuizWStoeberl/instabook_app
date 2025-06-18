import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Image, View, TextInput, Alert } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function PostsScreencs() {
  const navigation = useNavigation();
  const [imagem, setImagem] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  }

  async function uploadPost() {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado.");
      return;
    }

    try {
      let imageUrl = "";
      if (imagem) {
        const imgName = `${user.uid}_${Date.now()}`;
        const imgRef = ref(storage, `posts/${imgName}`);
        const response = await fetch(imagem);
        const blob = await response.blob();
        await uploadBytes(imgRef, blob);
        imageUrl = await getDownloadURL(imgRef);
      }

      const postData = {
        descricao,
        localizacao,
        imagens: imageUrl ? [imageUrl] : [],
        criadoEm: Timestamp.now(),
        userId: user.uid,
      };


      const userPostRef = collection(db, "users", user.uid, "posts");
      const postDoc = await addDoc(userPostRef, postData);

      await addDoc(collection(db, "posts"), {
        ...postData,
        refUserPost: `users/${user.uid}/posts/${postDoc.id}`,
      });

      Alert.alert("Sucesso", "Post enviado com sucesso!");
      setImagem(null);
      setDescricao("");
      setLocalizacao("");

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao enviar post.");
    }
  }

  return (
    <SafeAreaView style={styles.coontainer}>
      <Text style={styles.title}>Novo post</Text>

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />
      <TextInput
        placeholder="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
        style={styles.input}
      />

      <TouchableOpacity onPress={pickImage} style={{ marginVertical: 10 }}>
        <AntDesign name="camera" size={32} color="black" />
      </TouchableOpacity>

      {imagem && <Image source={{ uri: imagem }} style={{ width: 200, height: 200 }} />}

      <TouchableOpacity onPress={uploadPost} style={{ marginVertical: 10 }}>
        <AntDesign name="upload" size={32} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  coontainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#bdf9ab",
  },
  title: {
    fontSize: 45,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8
  }
});
