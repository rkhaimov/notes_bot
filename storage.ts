import { IStorage, LocationEntry, PhotoEntry, TextEntry } from './contracts';
import meta from './meta.json';
import fetch, { Response } from 'superagent';
import assert from 'assert';
import * as Stream from 'stream';
import admin, { firestore } from 'firebase-admin';
import fb from './fb.json';
import { getFirestore } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin/lib/app/credential';
import CollectionReference = firestore.CollectionReference;

export async function createStorage(): Promise<IStorage> {
  await request('get', '?path=app:/photos/').catch((error: Response) => {
    assert(error.status === 404);

    return request('put', '?path=app:/photos/');
  });

  return {
    addTextEntry: (entry) => addEntryToStore(entry),
    addPhotoEntry: async (entry, photo) => {
      await uploadPhoto(`${entry.photo}.png`, photo);

      return addEntryToStore({ ...entry, photo: `${entry.photo}.png` });
    },
    addLocationEntry: (entry) => addEntryToStore(entry),
  };
}

const firebase = admin.initializeApp({
  credential: admin.credential.cert(fb as unknown as ServiceAccount),
});

function addEntryToStore(entry: Entry) {
  const store = getFirestore(firebase);

  const collection = store.collection('entries') as CollectionReference<{
    date: number;
    additional: string;
  }>;

  const { date, ...additional } = entry;

  return collection.add({
    date: entry.date,
    additional: JSON.stringify(additional),
  });
}

type Entry = TextEntry | PhotoEntry | LocationEntry;

function request(method: 'get' | 'put' | 'post' | 'delete', url: string) {
  return fetch[method](
    `https://cloud-api.yandex.net/v1/disk/resources${url}`,
  ).set('Authorization', `OAuth ${meta.disk}`);
}

function uploadPhoto(name: string, photo: Stream.Readable) {
  return request('get', `/upload?path=app:/photos/${name}`).then(
    async (response) => {
      assert(typeof response.body.href === 'string');

      return fetch
        .put(response.body.href)
        .set('Content-Type', 'application/octet-stream')
        .send(await toBuffer());
    },
  );

  function toBuffer() {
    return new Promise<Buffer>((resolve) => {
      const data: any[] = [];

      photo.on('data', (chunk) => data.push(chunk));
      photo.on('end', () => resolve(Buffer.concat(data)));
    });
  }
}
