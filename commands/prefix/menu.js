/**
 * Command: help
 * Description: Shows all available commands in a royal embed.
 */

const { EmbedBuilder } = require("discord.js");
const { logError } = require("../../utils/logger");

module.exports = {
  name: "menu",
  description: "Shows the royal command menu.",

  execute(message) {
    try {
      const prefix = process.env.DISCORD_BOT_PREFIX || ".";

      // Collect commands
      const commands = message.client.commands
        .filter((cmd) => cmd.name && cmd.description)
        .map(
          (cmd) =>
            `👑 **${prefix}${cmd.name}**\n└─ ${cmd.description}`
        );

      if (!commands.length) {
        return message.reply("❌ No commands are currently available.");
      }

      // Royal Embed
      const embed = new EmbedBuilder()
        .setColor(0x2b6cb0) // Royal blue
        .setTitle("👑 M.B.B Royal Command Menu")
        .setDescription(
          "Welcome to the **royal command list**.\nUse the commands below wisely 👑\n\n" +
            commands.join("\n\n")
        )
        .setFooter({
          text: "👑 M.B.B • Royal Assistant",
          iconURL: message.client.user.displayAvatarURL(),
        })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      logError(`❌ Error executing help command: ${error}`);
      message.reply("❌ An error occurred while showing the help menu.");
    }
  },
}; 
