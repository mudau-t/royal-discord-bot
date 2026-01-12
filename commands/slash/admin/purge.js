const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { logError } = require("../../../utils/logger");

/**
 * Command: purge
 * Description: Purges a specified number of messages from a channel.
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete a number of messages from the channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete (1–100)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    try {
      // 🔐 Runtime permission check
      if (
        !interaction.member.permissions.has(
          PermissionFlagsBits.Administrator
        )
      ) {
        return interaction.reply({
          content: "❌ You do not have permission to use this command.",
          ephemeral: true,
        });
      }

      const amount = interaction.options.getInteger("amount");

      // 🧹 Bulk delete (auto-filters messages older than 14 days)
      const deletedMessages = await interaction.channel.bulkDelete(
        amount,
        true
      );

      if (deletedMessages.size === 0) {
        return interaction.reply({
          content:
            "❌ No messages could be deleted (messages may be older than 14 days).",
          ephemeral: true,
        });
      }

      await interaction.reply({
        content: `✅ Successfully deleted **${deletedMessages.size}** message(s).`,
        ephemeral: true,
      });
    } catch (error) {
      logError(`❌ Error executing purge command: ${error}`);

      if (!interaction.replied) {
        await interaction.reply({
          content:
            "❌ An error occurred while trying to purge the messages.",
          ephemeral: true,
        });
      }
    }
  },
};
