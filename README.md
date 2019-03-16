# @tridnguyen/firestore

[![Greenkeeper badge](https://badges.greenkeeper.io/tnguyen14/firestore.svg)](https://greenkeeper.io/)

> Simple wrapper around @google-cloud/firestore package

## Environment variables

This package assumes the following environment variables to always be set:

```shell
FIRESTORE_PROJECT_ID=<your-google-cloud-project-id>
SERVICE_ACCOUNT_JSON=<path-to-service-account-json-file>
# instructions for service account https://cloud.google.com/docs/authentication/getting-started
```

## Delete collection

The main reason for this package to exist is the implementation of the `deleteCollection` method, which retrieve all documents within the collection or subcollection and delete them, in batches. Inspired by <https://firebase.google.com/docs/firestore/manage-data/delete-data#collections>.

```js
const { firestore } = require('@tridnguyen/firestore');

const myDocRef = firestore.doc('docs/my-doc');

firestore.deleteCollection('docs/my-doc/sub-collection')
	.then(() => {
		return myDocRef.delete();
	});
```
