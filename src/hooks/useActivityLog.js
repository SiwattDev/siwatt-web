import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { db } from '../firebase'

function useActivityLog() {
    const logActivity = async (userId, action, details) => {
        const timestamp = serverTimestamp()

        try {
            const docRef = await addDoc(collection(db, 'activityLog'), {
                userId,
                action,
                details,
                timestamp
            })
            console.log('Document written with ID: ', docRef.id)
        } catch (e) {
            console.error('Error adding document: ', e)
        }
    }

    const getActivity = async (key, id) => {
        const q = query(collection(db, 'activityLog'), where(key, '==', id), orderBy('timestamp', 'desc'))

        try {
            const querySnapshot = await getDocs(q)
            let activities = []
            querySnapshot.forEach((doc) => {
                activities.push(doc.data())
            })

            if (activities.length === 0) {
                console.log('Não há atividades para a chave ou id solicitado.')
                return null
            }

            return activities
        } catch (e) {
            console.log('Error getting documents: ', e)
        }
    }


    return { logActivity, getActivity }
}

export default useActivityLog

