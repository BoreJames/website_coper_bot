// =============================
// 🇨🇳⃤҉ 𝐓𝐇𝐄-𝐋𝐄𝐆𝐈𝐎𝐍⃤҉ Website Coper Bot
// (c) 2025 cybixdev
// =============================

const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const axios = require('axios');

// === BOT SETTINGS (hardcoded) ===
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CHANNEL_ID = -1003081031970;
const GROUP_ID = -4989660657;
const TELEGRAM_CHANNEL_LINK = 'https://t.me/cybixtech';
const WHATSAPP_CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbB8svo65yD8WDtzwd0X';
const DEVELOPER_CONTACT = '@cybixdev';
const BOT_NAME = '🇨🇳⃤҉ 𝐓𝐇𝐄-𝐋𝐄𝐆𝐈𝐎𝐍⃤҉';
const GROUP_LINK = 'https://t.me/cybixtechgroup';
const BANNER_IMAGE_URL = 'https://files.catbox.moe/sj6fp9.jpg';

// === Markup Buttons ===
const mainKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'WhatsApp Channel', url: WHATSAPP_CHANNEL_LINK },
        { text: 'Telegram Channel', url: TELEGRAM_CHANNEL_LINK }
      ],
      [
        { text: 'Contact Developer', url: 'https://t.me/' + DEVELOPER_CONTACT.replace('@', '') }
      ]
    ]
  }
};

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// === MEMBERSHIP CHECK ===
async function checkMembership(userId) {
  try {
    // Check channel
    const ch = await bot.getChatMember(CHANNEL_ID, userId);
    if (!['member', 'administrator', 'creator'].includes(ch.status)) return false;
    // Check group
    const gr = await bot.getChatMember(GROUP_ID, userId);
    if (!['member', 'administrator', 'creator'].includes(gr.status)) return false;
    return true;
  } catch (e) {
    return false;
  }
}

// === Send Banner Image ===
async function sendBanner(chatId) {
  try {
    const response = await axios.get(BANNER_IMAGE_URL, { responseType: 'arraybuffer' });
    await bot.sendPhoto(chatId, Buffer.from(response.data, 'binary'), {
      caption: `👋 Welcome to *${BOT_NAME}*!`,
      parse_mode: 'Markdown',
      ...mainKeyboard
    });
  } catch (err) {
    await bot.sendMessage(chatId, `👋 Welcome to *${BOT_NAME}*!`, { ...mainKeyboard, parse_mode: 'Markdown' });
  }
}

// === Start/Help Handler ===
bot.onText(/\/start|\/help/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!(await checkMembership(userId))) {
    return bot.sendMessage(chatId,
      `👋 Welcome to *${BOT_NAME}*\n\n` +
      `To use this bot, you must join our [Telegram Channel](${TELEGRAM_CHANNEL_LINK}) and [Group](${GROUP_LINK}).\n\n` +
      `After joining, send /start again.`,
      { ...mainKeyboard, parse_mode: 'Markdown' }
    );
  }
  await sendBanner(chatId);
  bot.sendMessage(chatId,
    `Send me ANY website link (*example:* https://example.com).\n\n` +
    `I'll fetch the ENTIRE site and send you all its files as a ZIP archive!\n\n` +
    `*Features:*\n` +
    `- Forces users to join our Channel and Group\n` +
    `- Works in private, group, and channel chats\n` +
    `- Fetches and zips complete websites\n\n` +
    `*Send a valid website link to begin!*`,
    { ...mainKeyboard, parse_mode: 'Markdown' }
  );
});

// === Main Message Handler ===
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from && msg.from.id ? msg.from.id : null;
  if (!userId) return;

  if (msg.text && /^\/(start|help)/.test(msg.text)) return; // Already handled

  // ENFORCE MEMBERSHIP
  if (!(await checkMembership(userId))) {
    return bot.sendMessage(chatId,
      `❗ You must join our [Telegram Channel](${TELEGRAM_CHANNEL_LINK}) and [Group](${GROUP_LINK}) to use this bot.\n\nAfter joining, send /start again.`,
      { ...mainKeyboard, parse_mode: 'Markdown' }
    );
  }

  // EXTRACT URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = msg.text && msg.text.match(urlRegex);
  if (!urls || urls.length === 0) {
    return bot.sendMessage(chatId,
      `❌ Please send a valid website URL (e.g., https://example.com).`,
      { ...mainKeyboard }
    );
  }

  const url = urls[0];

  // Folder and file naming
  const safeId = `${userId}_${Date.now()}`;
  const downloadDir = path.join(__dirname, `site_${safeId}`);
  const zipPath = path.join(__dirname, `site_${safeId}.zip`);

  // 1. Send loading message
  const loadingMsg = await bot.sendMessage(chatId, `🔄 Downloading website... Please wait.`, mainKeyboard);

  // 2. Download Website
  exec(`wget --mirror --convert-links --adjust-extension --page-requisites --no-parent -P "${downloadDir}" "${url}"`, async (error) => {
    if (error) {
      cleanUp(downloadDir, zipPath);
      return bot.sendMessage(chatId,
        `❌ Failed to download website. Make sure the URL is correct and the site allows scraping.`,
        mainKeyboard
      );
    }

    // 3. Zip the downloaded site
    await zipDirectory(downloadDir, zipPath);

    // 4. Send ZIP file (check size)
    try {
      const stat = fs.statSync(zipPath);
      if (stat.size > 48 * 1024 * 1024) { // Telegram bot limit ~50MB
        cleanUp(downloadDir, zipPath);
        await bot.editMessageText(
          `❌ The zipped website is too large to send via Telegram (max: 50MB). Try a smaller site.`,
          { chat_id: chatId, message_id: loadingMsg.message_id, ...mainKeyboard }
        );
        return;
      }
      await bot.sendDocument(chatId, zipPath, {}, mainKeyboard);
      await bot.editMessageText(
        `✅ Website copied and zipped successfully! Download your ZIP below.`,
        { chat_id: chatId, message_id: loadingMsg.message_id, ...mainKeyboard }
      );
    } catch (e) {
      await bot.editMessageText(
        `❌ Error sending the ZIP file.`,
        { chat_id: chatId, message_id: loadingMsg.message_id, ...mainKeyboard }
      );
    }
    cleanUp(downloadDir, zipPath);
  });
});

// === Zip Directory ===
function zipDirectory(source, out) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    stream.on('close', resolve);
    archive.on('error', err => reject(err));

    archive.directory(source, false);
    archive.pipe(stream);
    archive.finalize();
  });
}

// === Clean Up ===
function cleanUp(downloadDir, zipPath) {
  try { fs.rmSync(downloadDir, { recursive: true, force: true }); } catch (e) {}
  try { fs.unlinkSync(zipPath); } catch (e) {}
}

// === Welcome new group members (optional) ===
bot.on('new_chat_members', async (msg) => {
  const chatId = msg.chat.id;
  if (msg.new_chat_members) {
    msg.new_chat_members.forEach(user => {
      bot.sendMessage(chatId,
        `👋 Welcome, ${user.first_name || 'user'}! To use *${BOT_NAME}*, join our [Telegram Channel](${TELEGRAM_CHANNEL_LINK}) and [Group](${GROUP_LINK}).`,
        { ...mainKeyboard, parse_mode: 'Markdown' }
      );
    });
  }
});

// === Error Handling ===
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// === Log startup ===
console.log(`${BOT_NAME} started!`);
