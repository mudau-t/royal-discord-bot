/**
 * Event: messageCreate
 * Triggered whenever a new message is created
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");
const { logError } = require("../utils/logger");

const PREFIX = process.env.DISCORD_BOT_PREFIX || ".";

// 📊 Levels system
const levelsPath = path.join(__dirname, "../data/levels.json");

// 📢 Broadcast system
const broadcastPath = path.join(__dirname, "../data/broadcast.json");
const OFFICIAL_SERVER_ID = process.env.OFFICIAL_SERVER_ID;
const OFFICIAL_CHANNEL_ID = process.env.OFFICIAL_CHANNEL_ID;

module.exports = {
  name: "messageCreate",

  async execute(message) {
    try {
      // 🚫 Ignore bots & DMs
      if (message.author.bot || !message.guild) return;

      /* =========================
         📊 LEVEL SYSTEM
      ========================= */
      let levelData = {};
      if (fs.existsSync(levelsPath)) {
        levelData = JSON.parse(fs.readFileSync(levelsPath, "utf8"));
      }

      const userId = message.author.id;
      if (!levelData[userId]) {
        levelData[userId] = { messages: 0 };
      }

      levelData[userId].messages += 1;
      fs.writeFileSync(levelsPath, JSON.stringify(levelData, null, 2));

      /* =========================
         📢 BROADCAST SYSTEM
      ========================= */
      if (
        message.guild.id === OFFICIAL_SERVER_ID &&
        message.channel.id === OFFICIAL_CHANNEL_ID
      ) {
        if (!fs.existsSync(broadcastPath)) return;

        const broadcastData = JSON.parse(
          fs.readFileSync(broadcastPath, "utf8")
        );

        const embed = new EmbedBuilder()
          .setTitle("👑 Official Announcement")
          .setDescription(message.content || " ")
          .setColor(0x5865f2)
          .setFooter({ text: "Official Bot Network" })
          .setTimestamp();

        for (const guildId in broadcastData) {
          try {
            const channelId = broadcastData[guildId];
            const channel =
              await message.client.channels.fetch(channelId).catch(() => null);

            if (channel) {
              await channel.send({ embeds: [embed] });
            }
          } catch (err) {
            logError(`❌ Broadcast failed for guild ${guildId}: ${err}`);
          }
        }
      }

      /* =========================
         ⚡ PREFIX COMMAND HANDLER
      ========================= */
      if (!message.content.startsWith(PREFIX)) return;

      const args = message.content
        .slice(PREFIX.length)
        .trim()
        .split(/ +/);

      const commandName = args.shift().toLowerCase();
      const command = message.client.commands.get(commandName);

      if (!command) return;

      await command.execute(message, args);
    } catch (error) {
      logError(`❌ messageCreate error: ${error}`);
    }
  },
};
