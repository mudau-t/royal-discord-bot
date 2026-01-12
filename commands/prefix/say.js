/**
 * Command: say
 * Description: Makes the bot repeat a message.
 */

const { PermissionsBitField } = require("discord.js");
const { logError } = require("../../utils/logger");

module.exports = {
  name: "say",
  description: "Make the bot repeat a message.",

  async execute(message, args) {
    // 🚫 Ignore DMs
    if (!message.guild) return;

    // 🚫 Permission check (user)
    if (
      !message.member ||
      !message.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return message.reply(
        "❌ You do not have permission to use this command."
      );
    }

    // 📝 Message to repeat
    const sayMessage = args.join(" ");
    if (!sayMessage) {
      return message.reply("❌ Please provide a message for me to repeat.");
    }

    try {
      // 🗑️ Delete user's command message (only if bot can)
      if (
        message.guild.members.me.permissions.has(
          PermissionsBitField.Flags.ManageMessages
        )
      ) {
        await message.delete().catch(() => {});
      }

      // 📢 Send repeated message
      await message.channel.send({ content: sayMessage });
    } catch (error) {
      logError(`❌ Error executing say command: ${error}`);
      message.channel.send(
        "❌ An error occurred while trying to repeat your message."
      );
    }
  },
}; 
