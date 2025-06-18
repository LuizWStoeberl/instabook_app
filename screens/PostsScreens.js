import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { View } from "react-native-web";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";

export default function PostsScreencs() {

    const navigation = useNavigation();

    const DATA = [
        {
            id: 1,
            title: 'Primeiro foto'
        },
        {
            id: 2,
            title: 'Segundo foto'
        },
        {
            id: 3,
            title: 'Terceiro foto'
        }
    ]

    const Item = ({ title }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );

    const numColumns = 3;
    const tamImage = Dimensions.get('window').width / numColumns;

    return (
        <SafeAreaView style={styles.coontainer}>
            <Text style={styles.title}> Novo post </Text>

            <View style={styles.menu}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Home')
                }}>
                    <Text style={styles.text}> Sair </Text>
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity>
                    <AntDesign name="camera" size={32} color="black" />
                </TouchableOpacity>
            </View>

             <View>
                <TouchableOpacity>
                    <AntDesign name="upload" size={32} color="black" />
                </TouchableOpacity>
            </View>  

            {/* <View> 
                <FlatList
                    data={DATA}
                    renderItem={({ item }) => <Item title={item.title} />}
                    keyExtractor={item => item.id}
                    numColumns={numColumns}
                />
            </View> */}



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
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    menu: {
        justifyContent: "flex-start"
    },
    text: {
        fontWeight: "semibold",
        fontSize: 20
    }
})