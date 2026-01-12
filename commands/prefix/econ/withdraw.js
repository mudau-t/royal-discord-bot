/**
 * Command: withdraw
 * Description: Withdraw money from your bank
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

module.exports = {
  name: "withdraw",
  aliases: ["wd"],
  description: "Withdraw money from your bank.",

  async execute(message, args) {
    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    // 🆕 Create account if missing
    if (!economy[message.author.id]) {
      economy[message.author.id] = {
        wallet: 10000,
        bank: 0,
      };
    }

    const user = economy[message.author.id];
    const amountArg = args[0];

    if (!amountArg) {
      return message.reply("❌ Please specify an amount to withdraw.");
    }

    let amount;
    if (amountArg.toLowerCase() === "all") {
      amount = user.bank;
    } else {
      amount = parseInt(amountArg);
    }

    if (!amount || amount <= 0) {
      return message.reply("❌ Please enter a valid amount.");
    }

    if (amount > user.bank) {
      return message.reply(
        `❌ You only have **${formatMoney(user.bank)}** in your bank.`
      );
    }

    user.bank -= amount;
    user.wallet += amount;

    fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));

    const embed = new EmbedBuilder()
      .setColor("#00ff99")
      .setTitle("💸 Withdrawal Successful")
      .addFields(
        { name: "💸 Withdrawn", value: formatMoney(amount), inline: true },
        { name: "👛 Wallet", value: formatMoney(user.wallet), inline: true },
        { name: "🏦 Bank", value: formatMoney(user.bank), inline: true }
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
}; 
