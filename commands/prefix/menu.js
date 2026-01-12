const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "menu",
  aliases: ["help"],

  async execute(message) {
    const prefix = process.env.DISCORD_BOT_PREFIX || ".";

    const cmds = message.client.prefixCommands;
    if (!cmds || cmds.size === 0) {
      return message.reply("❌ Commands not loaded.");
    }

    // Remove alias duplicates
    const unique = new Map();
    for (const cmd of cmds.values()) {
      unique.set(cmd.name, cmd);
    }

    // Categories (auto-detect by name)
    const categories = {
      "💰 Economy": [],
      "🎮 Fun": [],
      "⚙️ Utility": [],
      "👮 Moderation": [],
    };

    for (const cmd of unique.values()) {
      const name = cmd.name;

      if (
        ["balance", "bank", "deposit", "withdraw", "rob", "work", "daily", "shop", "buy", "inventory", "leaderboard"].includes(name)
      ) {
        categories["💰 Economy"].push(name);
      } else if (
        ["slap", "say", "gamble"].includes(name)
      ) {
        categories["🎮 Fun"].push(name);
      } else if (
        ["ping", "info", "server", "user", "profile", "menu"].includes(name)
      ) {
        categories["⚙️ Utility"].push(name);
      } else {
        categories["👮 Moderation"].push(name);
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("👑 M.B.B Command Menu")
      .setDescription(
        `Use **${prefix}<command>** to run a command\n\n✨ *Clean • Organized • Royal*`
      )
      .setColor(0x5865f2)
      .setThumbnail(message.client.user.displayAvatarURL())
      .setFooter({
        text: `Prefix: ${prefix} • M.B.B`,
      })
      .setTimestamp();

    for (const [cat, list] of Object.entries(categories)) {
      if (list.length === 0) continue;

      embed.addFields({
        name: cat,
        value: list.map(c => `\`${prefix}${c}\``).join("  "),
      });
    }

    await message.channel.send({ embeds: [embed] });
  },
};
