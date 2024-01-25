import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { storage } from '../firebase'

const useStorage = () => {
    const uploadFile = (path, string, filename) => {
        return new Promise((resolve, reject) => {
            const fnSplit = filename.split('.')
            const fn = fnSplit[0]
            const fnExtension = fnSplit[fnSplit.length - 1]
            const uuid = `${fn}-${new Date().getTime()}.${fnExtension}`
            const storageRef = ref(storage, path + '/' + uuid)

            uploadString(storageRef, string, 'data_url')
                .then(() => {
                    getDownloadURL(storageRef)
                        .then((url) => {
                            resolve(url)
                        })
                        .catch((err) => reject(err))
                })
                .catch((err) => reject(err))
        })
    }

    return { uploadFile }
}

export default useStorage
