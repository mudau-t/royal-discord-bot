const fs = require("fs");
const path = require("path");
const { PermissionsBitField } = require("discord.js");

const dataPath = path.join(__dirname, "../../data/broadcast.json");

module.exports = {
  name: "setup",
  description: "Set the broadcast channel for this server",

  async execute(message) {
    if (!message.guild) return;

    // Admin only
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return message.reply("❌ Admins only can use this command.");
    }

    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.reply("❌ Mention a channel: `.setup #channel`");
    }

    let data = {};
    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    }

    data[message.guild.id] = channel.id;

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    message.reply(
      `✅ Broadcast channel set to ${channel}\nOnly the bot should talk there.`
    );
  },
};
