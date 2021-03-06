const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
  projectId: process.env.FIRESTORE_PROJECT_ID
});

firestore.settings({
  timestampsInSnapshots: true
});

module.exports = firestore;

const FIRESTORE_BATCH_SIZE = 500;

module.exports.batchSize = FIRESTORE_BATCH_SIZE;

// copied from https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
// with modifications to:
// 1. use global firestore instance
// 2. fix the use of batchSize (which seems incorrect in the example
module.exports.deleteCollection = function deleteCollection(
  collectionPath
) {
  var collectionRef = firestore.collection(collectionPath);
  var query = collectionRef.orderBy('__name__');

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve, reject);
  });
};

function deleteQueryBatch(query, resolve, reject) {
  query
    .limit(FIRESTORE_BATCH_SIZE)
    .get()
    .then(snapshot => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0;
      }

      // Delete documents in a batch
      var batch = firestore.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then(numDeleted => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(query, resolve, reject);
      });
    })
    .catch(reject);
}
