const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Get the support server link"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🛠️ Support Server")
      .setDescription(
        "Need help or more information?\n\n" +
          "Join our **official support server** for:\n" +
          "• Bot support\n" +
          "• Updates & announcements\n" +
          "• Help with commands\n" +
          "• Community support"
      )
      .setColor(0x5865f2)
      .setFooter({ text: "Click the button below to join" });

    const button = new ButtonBuilder()
      .setLabel("Join Support Server")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/vRbdmVzk");

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  },
}; 
