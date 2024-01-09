import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase'
import useFirebase from './useFirebase'

const useAuth = () => {
    const { createDocument } = useFirebase()

    const createUser = (email, password, confirmPassword, data) => {
        return new Promise((resolve, reject) => {
            if (password !== confirmPassword) reject('Senhas não conferem.')
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user
                    data.email = email
                    createDocument('users', user.uid, data).them(() =>
                        resolve('Conta criada com sucesso.')
                    )
                })
                .catch((error) => {
                    console.error(error)
                    const errorCode = error.code
                    const errorMessage = error.message
                    // Verificar por que ocorreu o erro
                    reject(errorCode, errorMessage)
                })
        })
    }

    const loginInUser = (email, password) => {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user
                    resolve(user)
                })
                .catch((error) => {
                    console.error(error)
                    const errorCode = error.code
                    const errorMessage = error.message
                    reject(errorCode, errorMessage)
                })
        })
    }

    return { createUser, loginInUser }
}

export default useAuth
