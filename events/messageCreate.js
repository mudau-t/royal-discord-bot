/**
 * Event: messageCreate
 * Triggered whenever a new message is created
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder, Events } = require("discord.js");
const { logError } = require("../utils/logger");

const PREFIX = process.env.DISCORD_BOT_PREFIX || ".";

/* =========================
   📊 LEVEL SYSTEM
========================= */
const levelsPath = path.join(__dirname, "../data/levels.json");

/* =========================
   📢 BROADCAST SYSTEM
========================= */
const broadcastPath = path.join(__dirname, "../data/broadcast.json");
const OFFICIAL_SERVER_ID = process.env.OFFICIAL_SERVER_ID;
const OFFICIAL_CHANNEL_ID = process.env.OFFICIAL_CHANNEL_ID;

module.exports = {
  name: Events.MessageCreate,

  async execute(message) {
    try {
      /* =========================
         🚫 BASIC GUARDS
      ========================= */
      if (!message) return;
      if (message.author?.bot) return;
      if (!message.guild) return;

      /* =========================
         📊 LEVEL SYSTEM
      ========================= */
      let levelData = {};

      if (fs.existsSync(levelsPath)) {
        try {
          levelData = JSON.parse(fs.readFileSync(levelsPath, "utf8"));
        } catch {
          levelData = {};
        }
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
        OFFICIAL_SERVER_ID &&
        OFFICIAL_CHANNEL_ID &&
        message.guild.id === OFFICIAL_SERVER_ID &&
        message.channel.id === OFFICIAL_CHANNEL_ID
      ) {
        if (fs.existsSync(broadcastPath)) {
          let broadcastData = {};

          try {
            broadcastData = JSON.parse(
              fs.readFileSync(broadcastPath, "utf8")
            );
          } catch {
            broadcastData = {};
          }

          const embed = new EmbedBuilder()
            .setTitle("👑 Official Announcement")
            .setDescription(message.content || " ")
            .setColor(0x5865f2)
            .setFooter({ text: "Official Bot Network" })
            .setTimestamp();

          for (const guildId of Object.keys(broadcastData)) {
            try {
              const channelId = broadcastData[guildId];
              const channel = await message.client.channels
                .fetch(channelId)
                .catch(() => null);

              if (channel) {
                await channel.send({ embeds: [embed] });
              }
            } catch (err) {
              logError(`❌ Broadcast failed for guild ${guildId}: ${err}`);
            }
          }
        }
      }

      /* =========================
         ⚡ PREFIX COMMAND HANDLER
      ========================= */
      if (!message.content.startsWith(PREFIX)) return;

      if (!message.client.prefixCommands) {
        logError("❌ prefixCommands collection not found");
        return;
      }

      const args = message.content
        .slice(PREFIX.length)
        .trim()
        .split(/\s+/);

      const commandName = args.shift()?.toLowerCase();
      if (!commandName) return;

      const command = message.client.prefixCommands.get(commandName);
      if (!command) return;

      await command.execute(message, args);
    } catch (error) {
      logError(`❌ messageCreate error:\n${error.stack || error}`);
    }
  },
};
