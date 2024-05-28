import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import useActivityLog from './useActivityLog';
import useFirebase from './useFirebase';

const useAuth = () => {
    const { createDocument } = useFirebase()
    const { logAction } = useActivityLog()

    const createUser = (email, password, confirmPassword, data) => {
        return new Promise((resolve, reject) => {
            if (!password) reject('Senha invalida.')
            else if (password !== confirmPassword)
                reject('Senhas não conferem.')
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user
                    data.email = email
                    data.id = user.uid
                    createDocument('users', user.uid, data).then(() =>
                        resolve('Conta criada com sucesso.')
                    )
                    logAction('created entity', { entity: data.id })
                })
                .catch((error) => {
                    console.error(error)
                    const errorCode = error.code
                    const errorMessage = error.message
                    reject(errorCode, errorMessage)
                })
        })
    }

    const loginErrors = (error) => {
        switch (error) {
            case 'auth/invalid-email':
                return 'E-mail inválido'
            case 'auth/invalid-credential':
                return 'Senha inválida'
            default:
                return 'Erro inesperado ao fazer login'
        }
    }

    const loginInUser = (email, password) => {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user
                    resolve(user)
                    logAction('login in user', { user: user.uid })
                })
                .catch((error) => {
                    console.error(error.code)
                    reject(loginErrors(error.code))
                })
        })
    }

    const logout = () => {
        return new Promise((resolve, reject) => {
            signOut(auth)
                .then(() => resolve())
                .catch((err) => {
                    console.error(err)
                    reject(err)
                })
        })
    }

    return { createUser, loginInUser, logout }
}

export default useAuth
