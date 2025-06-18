import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { EmailInput, PasswordInput } from '../components/CustomInputs';


export default function LoginScreen() {

    const navigation = useNavigation();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const [errorMessage, setErrorMessage] = useState('');

    const login = async () => {
        if (!email || !password) {
            setErrorMessage('Informe o e-mail e senha.');
            return;
        }

        if (!regexEmail.test(email)) {
            setErrorMessage('E-mail inválido');
            return;
        }

        if (!regexPassword.test(password)) {
            setErrorMessage('A senha deve conter no mínimo 8 caracteres, letra maiúscula, minúscula, número e símbolo');
            return;
        }

        setErrorMessage('');

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user);
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
    }

    useEffect(() => {
        setErrorMessage('');
    }, [email, password])

    return (
        <SafeAreaView style={styles.container}>
            <View >
                <Text style={styles.title}>Faça seu Login</Text>
            </View>

            <View>
                <EmailInput value={email} setValue={setEmail}></EmailInput>

                <PasswordInput value={password} setValue={setPassword}></PasswordInput>

                <TouchableOpacity
                    onPress={() => {
                        navigation.push('ForgotPassword');
                    }}
                >
                    <Text>Esqueci a senha</Text>
                </TouchableOpacity>

                {errorMessage &&
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                }
                <PrimaryButton text={'Login'} action={() => {
                    login();
                }} />
            </View>


            <View>
                <Text style={styles.text}>Não possui conta?</Text>
            </View>

            <TouchableOpacity onPress={() => {
                navigation.navigate('Register')
            }} style={styles.buttonRegister}>
                <Text style={styles.buttonText}>Registre-se</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#bdf9ab",
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 50,
    },
    button: {
        padding: 15,
        borderRadius: 15,
        marginVertical: 15,
        backgroundColor: '#002200',
        borderWidth: 2
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold'
    },
    text: {
        textAlign: "center",
        fontWeight: "semibold",
        fontSize: 20
    },
    buttonRegister: {
        padding: 15,
        borderRadius: 15,
        marginVertical: 15,
        backgroundColor: '#437a36',
        borderWidth: 2
    }
})

