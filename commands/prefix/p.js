const fs = require("fs");
const path = "./data/levels.json";

function getLevel(messages) {
  if (messages >= 100) return 5;
  if (messages >= 60) return 4;
  if (messages >= 30) return 3;
  if (messages >= 10) return 2;
  if (messages >= 1) return 1;
  return 0;
}

module.exports = {
  name: "p",
  description: "Show your profile",

  async execute(message) {
    if (!fs.existsSync(path)) return message.reply("No data found.");

    const data = JSON.parse(fs.readFileSync(path));
    const user = message.mentions.users.first() || message.author;

    const userData = data[user.id];
    if (!userData) return message.reply("No profile yet.");

    const messages = userData.messages;
    const level = getLevel(messages);

    message.reply(
      `**USER NAME**\n` +
      `${user}\n\n` +
      `**MESSAGES**\n` +
      `${messages}\n\n` +
      `**LEVEL**\n` +
      `${level}\n\n` +
      `**PROFILE**\n` +
      `Level Progress: ${"█".repeat(level)}${"░".repeat(5 - level)}`
    );
  },
}; 
