import fb from './fb.json';
import { CollectionReference, getFirestore } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin/lib/app/credential';
import admin from 'firebase-admin';

const firebase = admin.initializeApp({
  credential: admin.credential.cert(fb as unknown as ServiceAccount),
});

const store = getFirestore(firebase);

const collection = store.collection('entries') as CollectionReference<{
  date: number;
  additional: string;
}>;

collection
  .get()
  .then((values) => values.docs.map((doc) => doc.data()))
  .then((docs) =>
    console.log(
      docs.sort((left, right) =>
        new Date(toDate(left.date))
          .toISOString()
          .localeCompare(new Date(toDate(right.date)).toISOString()),
      ),
    ),
  );

function toDate(date: number) {
  if (date < 2000000000) {
    return date * 1_000;
  }

  return date;
}
