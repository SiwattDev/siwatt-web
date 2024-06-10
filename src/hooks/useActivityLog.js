import { getAuth } from 'firebase/auth';
import useFirebase from './useFirebase';

const isMatch = (log, criteria) => {
    return Object.keys(criteria).every(key => {
        if (!(key in log)) {
            return false;
        }

        if (typeof criteria[key] === 'object' && criteria[key] !== null) {
            return isMatch(log[key], criteria[key]);
        }
        return log[key] === criteria[key];
    });
};


const useActivityLog = () => {
    const { createDocument, getDocumentsInCollectionWithQuery, getDocumentsInCollection } = useFirebase();

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

    const getActionsWithCriteria = (criteria) => {
        return new Promise((resolve, reject) => {
            const { userId, ...otherCriteria } = criteria;
            const queryPromise = userId ?
                getDocumentsInCollectionWithQuery('logs', 'userId', userId) :
                getDocumentsInCollection('logs');

            queryPromise
                .then((logs) => {
                    const filteredLogs = logs.filter(log => isMatch(log, otherCriteria));
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
        getActionsWithCriteria,
    };
};

export default useActivityLog;
