import { SafeAreaView, StyleSheet, Text } from "react-native";
import { View } from "react-native-web";


export default function PostsScreencs () {

    return(
        <SafeAreaView style={styles.coontainer}>
            <View>
                <Text style={styles.title}> Criar posts </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    coontainer: {
        flex: 1,
        padding: 20,
        backgroundColor: "#bdf9ab",
        justifyContent: "center",
    },
    title: {
        fontSize: 45,
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: 'bold'
    }
})