/**
 * Event: guildMemberAdd
 * Triggered when a new member joins the server
 */

const { EmbedBuilder } = require("discord.js");
const { logError, logInfo } = require("../utils/logger");

// 🔔 WELCOME CHANNEL ID
const WELCOME_CHANNEL_ID = "1459566631549272148";

module.exports = {
  name: "guildMemberAdd",

  async execute(member) {
    try {
      if (!member || !member.guild) return;

      const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
      if (!channel) {
        logError("❌ Welcome channel not found");
        return;
      }

      const memberCount = member.guild.memberCount;

      // 🌸 WELCOME EMBED
      const embed = new EmbedBuilder()
        .setColor(0x5865f2) // Royal blue
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(
          `**╔═══════ ✦ ✨ ✦ ═══════╗**\n` +
          `🌌✨ Welcome **${member.user.username}** to **RE:ZERO | NEXUS** ✨🌌\n` +
          `Where every story begins anew…\n` +
          `**╚═══════ ✦ ✨ ✦ ═══════╝**\n\n` +

          `💙 Chill • Friendly • Re:Zero inspired\n` +
          `Everyone is welcome — just be yourself.\n\n` +

          `📌 **Start your journey:**\n` +
          `➜ 📜 Read the rules\n` +
          `➜ 👋 Introduce yourself\n` +
          `➜ 🎭 Pick your roles to unlock the server\n\n` +

          `🌈 LGBTQ+ friendly | Respect all | No drama\n\n` +

          `🆘 Need help?\n` +
          `Open a ticket in **・tickets**\n\n` +

          `**YOU INFO**\n` +
          `👤 **User:** ${member}\n` +
          `🏠 **Server:** ${member.guild.name}\n` +
          `👥 **Member Count:** ${memberCount}\n\n` +

          `**╔═══════ ✦ 🌌 ✦ ═══════╗**\n` +
          `✨ Enjoy your stay — the nexus awaits ✨\n` +
          `**╚═══════ ✦ 🌌 ✦ ═══════╝**`
        )
        .setFooter({
          text: "Rem • Re:Zero Nexus",
          iconURL: member.guild.iconURL({ dynamic: true }),
        })
        .setTimestamp();

      await channel.send({ embeds: [embed] });

      logInfo(`👋 New member joined: ${member.user.tag}`);
    } catch (error) {
      logError(`❌ guildMemberAdd error: ${error.stack || error}`);
    }
  },
};
