import { getAuth } from 'firebase/auth';
import useFirebase from './useFirebase';

const useActivityLog = () => {
    const { createDocument, getDocumentsInCollectionWithQuery } = useFirebase();

    const logAction = (action, details) => {
        console.log('logging action: ', action, details);
        return new Promise((resolve, reject) => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                reject('No user logged in');
                return;
            }

            const logData = {
                action,
                details,
                userId: user.uid,
                timestamp: new Date(),
            };

            createDocument('logs', null, logData)
                .then((docRef) => resolve(docRef))
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    };

    const getActionsForDocument = (documentId) => {
        return new Promise((resolve, reject) => {
            getDocumentsInCollectionWithQuery('logs', 'details.user', documentId)
                .then((logs) => resolve(logs))
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    };

    const getActionsByUser = (userId) => {
        return new Promise((resolve, reject) => {
            getDocumentsInCollectionWithQuery('logs', 'userId', userId)
                .then((logs) => resolve(logs))
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    };

    const getActionsByUserForDocument = (userId, documentId) => {
        return new Promise((resolve, reject) => {
            getDocumentsInCollectionWithQuery('logs', 'userId', userId)
                .then((logs) => {
                    const filteredLogs = logs.filter(log => log.details.user === documentId);
                    resolve(filteredLogs);
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    };

    return {
        logAction,
        getActionsForDocument,
        getActionsByUser,
        getActionsByUserForDocument,
    };
};

export default useActivityLog;
