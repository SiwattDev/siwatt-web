import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

const useFirebase = () => {
    const getDocumentById = (path, id) => {
        return new Promise((resolve, reject) => {
            const docRef = doc(db, path, id)
            getDoc(docRef)
                .then((doc) => {
                    if (!doc.exists()) reject('No such document!')
                    else resolve(doc.data())
                })
                .catch((error) => {
                    console.error(error)
                    reject(error)
                })
        })
    }

    const getDocumentsInCollection = (path) => {
        return new Promise((resolve, reject) => {
            const collectionRef = collection(db, path)
            getDocs(collectionRef)
                .then((docs) => {
                    resolve(docs.data.map((doc) => doc.data()))
                })
                .catch((error) => {
                    console.error(error)
                    reject(error)
                })
        })
    }

    const createDocument = (path, id, data) => {
        return new Promise((resolve, reject) => {
            if (id) {
                setDoc(doc(db, path, id), data)
                    .then(() => resolve(id))
                    .catch((error) => reject(error))
            } else {
                addDoc(collection(db, path), data)
                    .then((docRef) => resolve(docRef))
                    .catch((error) => {
                        console.error(error)
                        reject(error)
                    })
            }
        })
    }

    const updateDocument = (path, id, data) => {
        return new Promise((resolve, reject) => {
            updateDoc(doc(db, path, id), data)
                .then(() => resolve(true))
                .catch((error) => {
                    console.error(error)
                    reject(error)
                })
        })
    }

    const deleteDocument = (path, id) => {
        return new Promise((resolve, reject) => {
            deleteDoc(doc(db, path, id))
                .then(() => resolve(''))
                .catch((error) => {
                    console.error(error)
                    reject(error)
                })
        })
    }

    return {
        getDocumentById,
        getDocumentsInCollection,
        createDocument,
        updateDocument,
        deleteDocument,
    }
}

export default useFirebase
