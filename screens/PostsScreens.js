import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Image, View, TextInput, Alert } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../firebase.js';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import * as FileSystem from 'expo-file-system';


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
      let imagePaths = [];
  
      if (imagem) {
        const nomeArquivo = `${user.uid}_${Date.now()}.jpg`;
  
        // Caminhos locais
        const caminhoGeral = `${FileSystem.documentDirectory}geral/${nomeArquivo}`;
        const caminhoUsuario = `${FileSystem.documentDirectory}usuarios/${user.uid}/${nomeArquivo}`;
  
        // Criação das pastas se não existirem
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}geral/`, { intermediates: true });
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}usuarios/${user.uid}/`, { intermediates: true });
  
        // Copiando a imagem para os dois destinos
        await FileSystem.copyAsync({ from: imagem, to: caminhoGeral });
        await FileSystem.copyAsync({ from: imagem, to: caminhoUsuario });
  
        imagePaths = [caminhoGeral, caminhoUsuario];
      }
  
      const postData = {
        descricao,
        localizacao,
        imagens: imagePaths,
        criadoEm: Timestamp.now(),
        userId: user.uid,
      };
  
      // Cria o post na subcoleção do usuário
      const userPostRef = collection(db, "users", user.uid, "posts");
      const postDoc = await addDoc(userPostRef, postData);
  
      // Cria post geral com referência
      await addDoc(collection(db, "posts"), {
        ...postData,
        refUserPost: `users/${user.uid}/posts/${postDoc.id}`,
      });
  
      Alert.alert("Sucesso", "Post salvo localmente!");
      setImagem(null);
      setDescricao("");
      setLocalizacao("");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao salvar post.");
    }
  }
  


  return (
    <SafeAreaView style={styles.coontainer}>
      <Text style={styles.title}>Novo post</Text>

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={styles.inputDescription}
      />
      <TextInput
        placeholder="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
        style={styles.input}
      />

      <TouchableOpacity onPress={pickImage} style={{ marginVertical: 10 }}>
        <AntDesign name="camera" size={50} color="black" />
      </TouchableOpacity>

        {imagem && <Image style={styles.image} source={{ uri: imagem }}  />}



      <TouchableOpacity onPress={async () => {
        await uploadPost();
        navigation.navigate('Home');
      }} style={styles.buttonRegister}
      >
        <Text style={styles.buttonText}>Postar</Text>
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
  },
  inputDescription: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    height: 100,
  },
  image: {
    width: 200,
    height: 200,
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 2,
    alignSelf: "center"
  },
  buttonRegister: {
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
    backgroundColor: '#437a36',
    borderWidth: 2
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold'
  }
});
