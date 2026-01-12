/**
 * Command: deposit
 * Description: Deposit money into your bank
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

module.exports = {
  name: "deposit",
  aliases: ["dep"],
  description: "Deposit money into your bank.",

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

    // ❌ No amount
    if (!amountArg) {
      return message.reply("❌ Please specify an amount to deposit.");
    }

    // 🔢 All money
    let amount;
    if (amountArg.toLowerCase() === "all") {
      amount = user.wallet;
    } else {
      amount = parseInt(amountArg);
    }

    if (!amount || amount <= 0) {
      return message.reply("❌ Please enter a valid amount.");
    }

    if (amount > user.wallet) {
      return message.reply(
        `❌ You only have **${formatMoney(user.wallet)}** in your wallet.`
      );
    }

    user.wallet -= amount;
    user.bank += amount;

    fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));

    const embed = new EmbedBuilder()
      .setColor("#00ccff")
      .setTitle("🏦 Deposit Successful")
      .addFields(
        { name: "💰 Deposited", value: formatMoney(amount), inline: true },
        { name: "👛 Wallet", value: formatMoney(user.wallet), inline: true },
        { name: "🏦 Bank", value: formatMoney(user.bank), inline: true }
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
}; 
