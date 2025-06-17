import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-web"


export default function HomeScreen() {

    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <Text>Tela Inicial</Text>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Profile')
            }}>
                <Text>Perfil</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}