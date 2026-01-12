/**
 * Command: bank
 * Description: View your bank, wallet and total balance
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

module.exports = {
  name: "bank",
  description: "View your bank account",

  async execute(message) {
    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    // Create account if missing
    if (!economy[message.author.id]) {
      economy[message.author.id] = {
        wallet: 10000,
        bank: 0
      };
      fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));
    }

    const { wallet, bank } = economy[message.author.id];
    const total = wallet + bank;

    const embed = new EmbedBuilder()
      .setColor("#1e90ff")
      .setTitle("🏦 Royal Bank")
      .addFields(
        { name: "💰 Wallet", value: formatMoney(wallet), inline: true },
        { name: "🏦 Bank", value: formatMoney(bank), inline: true },
        { name: "👑 Total", value: formatMoney(total), inline: false }
      )
      .setFooter({ text: message.author.username })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
}; 
