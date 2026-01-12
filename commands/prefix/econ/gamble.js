/**
 * Command: gamble
 * Description: Gamble your money for a chance to win big
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

const COOLDOWN = 30 * 1000; // 30 seconds
const WIN_MULTIPLIER = 2;

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

module.exports = {
  name: "gamble",
  description: "Gamble your money for a chance to win.",

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
        lastGamble: 0,
      };
    }

    const user = economy[message.author.id];
    const bet = parseInt(args[0]);
    const now = Date.now();

    // ❌ Invalid bet
    if (!bet || bet <= 0) {
      return message.reply("❌ Please enter a valid amount to gamble.");
    }

    // ❌ Not enough money
    if (bet > user.wallet) {
      return message.reply(
        `❌ You don’t have enough money. Your wallet: **${formatMoney(
          user.wallet
        )}**`
      );
    }

    // ⏳ Cooldown
    if (user.lastGamble && now - user.lastGamble < COOLDOWN) {
      const seconds = Math.ceil(
        (COOLDOWN - (now - user.lastGamble)) / 1000
      );
      return message.reply(
        `⏳ Slow down! Try again in **${seconds}s**.`
      );
    }

    const win = Math.random() < 0.5; // 50/50
    user.lastGamble = now;

    let embed;

    if (win) {
      const winnings = bet * WIN_MULTIPLIER;
      user.wallet += bet;

      embed = new EmbedBuilder()
        .setColor("#00ff99")
        .setTitle("🎉 YOU WON!")
        .setDescription(
          `Luck is on your side 👑\nYou won **${formatMoney(
            winnings
          )}**`
        )
        .addFields({
          name: "💰 New Wallet Balance",
          value: formatMoney(user.wallet),
        });
    } else {
      user.wallet -= bet;

      embed = new EmbedBuilder()
        .setColor("#ff4444")
        .setTitle("💀 YOU LOST")
        .setDescription(
          `The house wins 😈\nYou lost **${formatMoney(bet)}**`
        )
        .addFields({
          name: "💰 New Wallet Balance",
          value: formatMoney(user.wallet),
        });
    }

    fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));

    embed
      .setFooter({ text: "Gamble responsibly 👑" })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
