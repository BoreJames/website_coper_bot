# 🇨🇳⃤҉ 𝐓𝐇𝐄-𝐋𝐄𝐆𝐈𝐎𝐍⃤҉ Website Copier Telegram Bot

## Description

A powerful Telegram bot that copies websites:  
- Paste a web URL, get a ZIP of all HTML/CSS/JS/images.
- Works in private, group, and channel chats.
- Forces users to join your Telegram channel **and** group.
- Always shows WhatsApp/Telegram/Developer contact buttons.
- Sends a banner image on `/start`.

---

## Features

- **Website Copier**: Send a URL, get a zipped copy of the site.
- **Force Join**: Users must join both the Telegram channel and group.
- **Banner Image**: Beautiful image shown on start.
- **All Buttons**: WhatsApp, Telegram, and Developer contact on every message.
- **Works everywhere**: Private chats, groups, and channels.
- **No API config**: All settings hardcoded for instant deployment.

---

## Requirements

- **Node.js v16+** (recommended)
- **npm** (Node.js package manager)
- **wget** and **zip** installed on your system  
  (Linux: `sudo apt install wget zip`  
  macOS: `brew install wget zip`  
  Windows: [wget for Windows](https://eternallybored.org/misc/wget/) + [7-Zip](https://www.7-zip.org/))
- A server or PC to run the bot.
- Your bot token and admin rights in the channel/group.

---

## Installation & Setup

### 1. Clone the repository or copy the files

```bash
git clone https://github.com/BoreJames/website_coper_bot.git
cd website-coper-bot
# OR just put the files in a folder
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Make sure `wget` and `zip` are installed

- **Ubuntu/Debian:**
  ```bash
  sudo apt update
  sudo apt install wget zip
  ```
- **macOS:**
  ```bash
  brew install wget zip
  ```
- **Windows:**
  - Download [wget.exe](https://eternallybored.org/misc/wget/) and put it in your PATH.
  - Download and install [7-Zip](https://www.7-zip.org/).  
    (You may need to adjust the code if you want to use 7z instead of zip.)

### 4. Run the bot

```bash
npm start
# or
npm run
```

---

## Usage

1. **Add the bot to your Telegram group, channel, or use it privately.**
2. **Make sure users join both the channel and group to use the bot.**
3. **Send `/start` to see the welcome banner and instructions.**
4. **Paste any website link (e.g., https://example.com).**
5. **Wait for the "Downloading..." message.**
6. **Get your ZIP file right in Telegram!**

---

## Configuration

All settings (token, channel/group IDs, links, developer contact, etc.) are **hardcoded** in `website_coper_bot.js` for ease of deployment.  
If you need to change these, edit the following section at the top of the file:

```js
// === BOT SETTINGS (hardcoded) ===
const BOT_TOKEN = 'YOUR_BOT_TOKEN';
const CHANNEL_ID = -100xxxxxxxxx; // Telegram channel (negative number)
const GROUP_ID = -xxxxxxxxx;      // Telegram group (negative number)
const TELEGRAM_CHANNEL_LINK = 'https://t.me/yourchannel';
const WHATSAPP_CHANNEL_LINK = 'https://whatsapp.com/channel/.....';
const DEVELOPER_CONTACT = '@yourusername';
const BOT_NAME = '🇨🇳⃤҉ 𝐓𝐇𝐄-𝐋𝐄𝐆𝐈𝐎𝐍⃤҉';
const GROUP_LINK = 'https://t.me/yourgroup';
const BANNER_IMAGE_URL = 'https://yourimage.url/banner.jpg';
```

---

## Troubleshooting

- **Bot doesn't respond?**
  - Check your BOT_TOKEN.
  - Make sure the bot is an admin in your channel/group.
  - Make sure you have `wget` and `zip` installed and available in your system PATH.
  - Check for logs in your terminal.

- **ZIP too large?**
  - Telegram bots can only send files up to 50MB. Try a smaller website.

- **Permission errors?**
  - Run the bot with permissions to read/write in its folder.

---

## Credits

- Powered by [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- Uses [Archiver](https://www.npmjs.com/package/archiver) for zipping
- Website downloading by [wget](https://www.gnu.org/software/wget/)

---

## License

MIT — Yours to use and modify!
