import Bot from 'node-telegram-bot-api';
import { storage } from './storage';
import assert from 'assert';

assert(process.env.TOKEN !== undefined);

const bot = new Bot(process.env.TOKEN, { polling: true });

bot.on('text', async (msg) => {
  assert(typeof msg.text === 'string');

  await storage.addTextEntry({ date: msg.date, text: msg.text });

  return bot.sendMessage(msg.chat.id, 'Saved');
});

bot.on('photo', async (msg) => {
  assert(Array.isArray(msg.photo));

  const best = msg.photo[msg.photo.length - 1];

  assert(best !== undefined);

  await storage.addPhotoEntry(
    { date: msg.date, photo: best.file_id },
    bot.getFileStream(best.file_id),
  );

  return bot.sendMessage(msg.chat.id, 'Saved');
});

bot.on('location', async (msg) => {
  assert(msg.location !== undefined);

  await storage.addLocationEntry({
    date: msg.date,
    latitude: msg.location.latitude,
    longitude: msg.location.longitude,
  });

  return bot.sendMessage(msg.chat.id, 'Saved');
});
