const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "joke",
  description: "Fetches a random joke",

  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Fetches a random joke"),

  async execute(interaction) {
    try {
      const response = await fetch(
        "https://official-joke-api.appspot.com/random_joke"
      );

      const joke = await response.json();

      await interaction.reply(
        `😂 **${joke.setup}**\n\n*${joke.punchline}*`
      );
    } catch (error) {
      console.error("Joke error:", error);

      await interaction.reply({
        content: "❌ Joke service is unavailable.",
        ephemeral: true,
      });
    }
  },
};
