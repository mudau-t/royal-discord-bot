/**
 * Command: balance
 * Aliases: bal, money
 * Description: Check your or another user's balance
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

module.exports = {
  name: "balance",
  aliases: ["bal", "money"],
  description: "Check your balance or another user's balance.",

  async execute(message, args) {
    // 👤 Target user (mention or self)
    const user = message.mentions.users.first() || message.author;

    // 📂 Load economy data
    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    // 🆕 Create account if missing (START WITH R10,000)
    if (!economy[user.id]) {
      economy[user.id] = {
        wallet: 10000, // 👑 Starting money
        bank: 0,
      };

      fs.writeFileSync(
        economyPath,
        JSON.stringify(economy, null, 2)
      );
    }

    const { wallet, bank } = economy[user.id];

    // 🎨 Embed
    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("👑 Royal Balance")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "💰 Wallet", value: formatMoney(wallet), inline: true },
        { name: "🏦 Bank", value: formatMoney(bank), inline: true }
      )
      .setFooter({
        text: `Requested by ${message.author.username}`,
      })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  },
}; 
