const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "slap",
  description: "Slap someone in a royal way 👑",

  execute(message) {
    const target = message.mentions.users.first();

    if (!target)
      return message.reply("❌ Mention someone to slap!");

    if (target.id === message.author.id)
      return message.reply("❌ You can't slap yourself 👀");

    const embed = new EmbedBuilder()
      .setColor(0xff5555)
      .setTitle("👑 Royal Slap!")
      .setDescription(
        `💥 **${message.author.username}** slapped **${target.username}** with royal power!`
      )
      .setImage("https://media.tenor.com/slap.gif") // optional
      .setFooter({ text: "M.B.B • Royal Actions" })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
