const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { logError, logWarn } = require("../../../utils/logger");

/**
 * Command: warn
 * Description: Warns a member and logs it.
 */

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member for breaking rules")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member to warn")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the warning")
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    try {
      // 🔐 Runtime permission check (important)
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

      // 👤 Get guild member
      const member = interaction.options.getMember("target");
      if (!member) {
        return interaction.reply({
          content: "❌ Member not found.",
          ephemeral: true,
        });
      }

      const reason =
        interaction.options.getString("reason") ||
        "No reason provided.";

      // ⚠️ Warn message
      await interaction.reply(
        `⚠️ **Warning Issued**\n\n👤 Member: ${member.user.tag}\n📄 Reason: ${reason}`
      );

      // 📝 Log warning (placeholder)
      logWarn(
        `⚠️ WARN | ${member.user.tag} (${member.id}) | Reason: ${reason}`
      );
    } catch (error) {
      logError(`❌ Error executing warn command: ${error}`);

      if (!interaction.replied) {
        await interaction.reply({
          content: "❌ An error occurred while issuing the warning.",
          ephemeral: true,
        });
      }
    }
  },
}; 
