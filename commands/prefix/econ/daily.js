/**
 * Command: daily
 * Description: Claim your daily reward
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

const DAILY_AMOUNT = 2500;
const COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

module.exports = {
  name: "daily",
  description: "Claim your daily reward.",

  async execute(message) {
    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    const userId = message.author.id;
    const now = Date.now();

    // 🆕 Create account if missing
    if (!economy[userId]) {
      economy[userId] = {
        wallet: 10000,
        bank: 0,
        lastDaily: 0,
      };
    }

    const lastDaily = economy[userId].lastDaily || 0;
    const timeLeft = COOLDOWN - (now - lastDaily);

    // ⏳ Cooldown check
    if (timeLeft > 0) {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
      );

      const cooldownEmbed = new EmbedBuilder()
        .setColor("#ED4245")
        .setTitle("⏳ Daily Reward")
        .setDescription(
          `You already claimed your daily reward.\n\n⏰ Try again in **${hours}h ${minutes}m**`
        )
        .setFooter({ text: "Royal Economy System" })
        .setTimestamp();

      return message.reply({ embeds: [cooldownEmbed] });
    }

    // 💰 Give reward
    economy[userId].wallet += DAILY_AMOUNT;
    economy[userId].lastDaily = now;

    fs.writeFileSync(
      economyPath,
      JSON.stringify(economy, null, 2)
    );

    const successEmbed = new EmbedBuilder()
      .setColor("#57F287")
      .setTitle("👑 Daily Reward Claimed!")
      .setDescription(
        `You received **${formatMoney(DAILY_AMOUNT)}** 💸\n\n` +
        `💰 Wallet: **${formatMoney(economy[userId].wallet)}**`
      )
      .setFooter({ text: "Come back tomorrow!" })
      .setTimestamp();

    message.channel.send({ embeds: [successEmbed] });
  },
}; 
