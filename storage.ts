import fs from 'fs';
import { TextEntry, IStorage, PhotoEntry, LocationEntry } from './contracts';

if (fs.existsSync('./store.json') === false) {
  fs.writeFileSync('./store.json', '[]');
}

if (fs.existsSync('./photos') === false) {
  fs.mkdirSync('./photos');
}

export const storage: IStorage = {
  addTextEntry: async (entry) => {
    const store: Store = JSON.parse(fs.readFileSync('./store.json').toString());

    store.push(entry);

    fs.writeFileSync('./store.json', JSON.stringify(store));
  },
  addPhotoEntry: async (entry, photo) => {
    photo.pipe(fs.createWriteStream(`./photos/${entry.photo}.png`));

    const store: Store = JSON.parse(fs.readFileSync('./store.json').toString());

    store.push(entry);

    fs.writeFileSync('./store.json', JSON.stringify(store));
  },
  addLocationEntry: async (entry) => {
    const store: Store = JSON.parse(fs.readFileSync('./store.json').toString());

    store.push(entry);

    fs.writeFileSync('./store.json', JSON.stringify(store));
  },
};

type Store = Array<TextEntry | PhotoEntry | LocationEntry>;
