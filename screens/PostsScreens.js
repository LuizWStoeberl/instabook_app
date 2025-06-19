import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, Image, View, TextInput, Alert } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';

import { useNavigation } from "@react-navigation/native";
import { db, auth } from '../firebase.js';
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

    async function pegarLocalizacaoAtual() {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Permita o acesso à localização nas configurações.');
            return;
        }

        const local = await Location.getCurrentPositionAsync({});
        const endereco = await Location.reverseGeocodeAsync(local.coords);

        if (endereco.length > 0) {
            const { city, region, street } = endereco[0];
            const textoLocal = `${street}, ${city} - ${region}`;
            setLocalizacao(textoLocal);
        } else {
            setLocalizacao(`Lat: ${local.coords.latitude}, Lon: ${local.coords.longitude}`);
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
                const caminhoGeral = `${FileSystem.documentDirectory}geral/${nomeArquivo}`;
                const caminhoUsuario = `${FileSystem.documentDirectory}usuarios/${user.uid}/${nomeArquivo}`;

                await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}geral/`, { intermediates: true });
                await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}usuarios/${user.uid}/`, { intermediates: true });

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
                userEmail: user.email,
            };

            const userPostRef = collection(db, "users", user.uid, "posts");
            const postDoc = await addDoc(userPostRef, postData);

            await addDoc(collection(db, "posts"), {
                ...postData,
                refUserPost: `users/${user.uid}/posts/${postDoc.id}`,
            });

            Alert.alert("Sucesso", "Post salvo!");
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

            <TouchableOpacity onPress={pegarLocalizacaoAtual} style={styles.localizacaoBtn}>
                <Text style={styles.localizacaoText}>Usar Localização Atual</Text>
                <Entypo name="location-pin" size={24} color="white" />
            </TouchableOpacity>

            {localizacao !== "" && (
                <Text style={{ marginTop: 10, fontStyle: 'italic' }}>
                    Local detectado: {localizacao}
                </Text>
            )}

            <View style={styles.icones}>
                <TouchableOpacity onPress={pickImage}>
                    <AntDesign name="picture" size={50} color="black" />
                </TouchableOpacity>
            </View>

            {imagem && <Image style={styles.image} source={{ uri: imagem }} />}

            <TouchableOpacity onPress={async () => {
                await uploadPost();
                navigation.navigate('Home');
            }} style={styles.buttonRegister}>
                <Text style={styles.buttonText}>Postar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonRegister}>
                <Text style={styles.buttonText}>Voltar</Text>
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
    inputDescription: {
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 10,
        borderRadius: 8,
        height: 100,
    },
    localizacaoBtn: {
        backgroundColor: '#437a36',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    localizacaoText: {
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 5
    },
    image: {
        width: 200,
        height: 200,
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 2,
        alignSelf: "center",
        marginTop: 10
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
    },
    icones: {
        flexDirection: "row",
        padding: 10,
        justifyContent: "center",
    },
});
