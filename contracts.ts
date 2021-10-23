import * as Stream from 'stream';

export interface IStorage {
  addTextEntry(entry: TextEntry): Promise<unknown>;

  addPhotoEntry(entry: PhotoEntry, photo: Stream.Readable): Promise<unknown>;

  addLocationEntry(entry: LocationEntry): Promise<unknown>;
}

export type TextEntry = {
  date: number;
  text: string;
};

export type PhotoEntry = {
  date: number;
  photo: string;
};

export type LocationEntry = {
  date: number;
  latitude: number;
  longitude: number;
};
