import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Button, SafeAreaView } from "react-native-web";


export default function LoginScreen () {

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.title}>Faça seu Login</Text>
            </View>
            
            <TouchableOpacity style={styles.button}>
                
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 50
    },
    button: {
        padding:15,
        borderRadius: 15,
        marginVertical: 15
    }
})

