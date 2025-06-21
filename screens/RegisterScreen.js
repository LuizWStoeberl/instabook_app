import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { EmailInput, NameInput, PasswordInput } from '../components/CustomInputs';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {

    const navigation = useNavigation();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');

    const register = async () => {
        if (!email || !password) {
            setErrorMessage('Informe e-mail e senha.');
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

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name
            });

            
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                name: name
            });

            console.log('Usuário registrado com sucesso:', user.email);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Erro ao registrar usuário:', error.message);
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        setErrorMessage('');
    }, [email, password]);

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={styles.containerFilho}>
            <View >
                <Text style={styles.title}>Registrar-se</Text>

                <EmailInput value={email} setValue={setEmail} />
                <PasswordInput value={password} setValue={setPassword} />
                <NameInput value={name} setValue={setName} />

                {errorMessage &&
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                }

                <PrimaryButton text={"Registrar-se"} action={register} />

                <Text style={styles.text}>Já tem uma conta?</Text>

                <SecondaryButton text={'Voltar para Login'} action={() => navigation.goBack()} />
            </View>
        </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#bdf9ab",
        paddingTop: 80
    },
    containerFilho: {
         flex: 1,
        padding: 10,
        backgroundColor: "#bdf9ab",
        width: 500,
        height: 600,
        alignItems: "center",
        alignSelf: "center"
    },
    title: {
        fontSize: 45,
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: 'bold'
    },
    errorMessage: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
        marginVertical: 10,
    },
    text: {
        textAlign: "center",
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 15,
    }
});
