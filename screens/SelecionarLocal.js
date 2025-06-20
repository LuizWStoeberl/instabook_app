// SelecionarLocal.js
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

export default function SelecionarLocal({ route }) {
    const navigation = useNavigation();
    const [selectedLocation, setSelectedLocation] = useState(null);

    function handleMapPress(event) {
        setSelectedLocation(event.nativeEvent.coordinate);
    }

    async function confirmarLocalizacao() {
        if (!selectedLocation) {
            Alert.alert('Erro', 'Selecione um local no mapa.');
            return;
        }

        const endereco = await Location.reverseGeocodeAsync(selectedLocation);
        let textoEndereco = `Lat: ${selectedLocation.latitude}, Lon: ${selectedLocation.longitude}`;

        if (endereco.length > 0) {
            const { street, city, region } = endereco[0];
            textoEndereco = `${street}, ${city} - ${region}`;
        }

        // Retorna para a tela anterior com o endereço escolhido
        navigation.navigate("Posts", { localizacaoEscolhida: textoEndereco });
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -23.55052,
                    longitude: -46.633308,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onPress={handleMapPress}
            >
                {selectedLocation && (
                    <Marker coordinate={selectedLocation} />
                )}
            </MapView>
            <TouchableOpacity style={styles.button} onPress={confirmarLocalizacao}>
                <Text style={styles.buttonText}>Confirmar Localização</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    button: {
        backgroundColor: '#437a36',
        padding: 15,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    }
});
