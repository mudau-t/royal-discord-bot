/**
 * Command: profile
 * Description: View your or another user's profile
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");
const levelsPath = path.join(__dirname, "../../../data/levels.json");

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

// Simple level formula
function getLevel(messages) {
  if (messages >= 1000) return 10;
  if (messages >= 500) return 9;
  if (messages >= 300) return 8;
  if (messages >= 200) return 7;
  if (messages >= 120) return 6;
  if (messages >= 70) return 5;
  if (messages >= 30) return 4;
  if (messages >= 10) return 3;
  if (messages >= 3) return 2;
  return 1;
}

module.exports = {
  name: "p",
  aliases: ["p"],
  description: "View your or another user's profile.",

  async execute(message) {
    const user =
      message.mentions.users.first() || message.author;

    // 📂 Load economy
    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    // 📂 Load levels
    let levels = {};
    if (fs.existsSync(levelsPath)) {
      levels = JSON.parse(fs.readFileSync(levelsPath, "utf8"));
    }

    // 🆕 Create economy account if missing
    if (!economy[user.id]) {
      economy[user.id] = {
        wallet: 10000,
        bank: 0,
      };
    }

    // 🆕 Create level data if missing
    if (!levels[user.id]) {
      levels[user.id] = { messages: 0 };
    }

    const wallet = economy[user.id].wallet;
    const bank = economy[user.id].bank;
    const total = wallet + bank;

    const messages = levels[user.id].messages;
    const level = getLevel(messages);

    const embed = new EmbedBuilder()
      .setColor("#9b59b6")
      .setTitle("👑 Royal Profile")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "👤 User", value: `<@${user.id}>`, inline: true },
        { name: "⭐ Level", value: `Level ${level}`, inline: true },
        { name: "💬 Messages", value: messages.toString(), inline: true },

        { name: "👛 Wallet", value: formatMoney(wallet), inline: true },
        { name: "🏦 Bank", value: formatMoney(bank), inline: true },
        { name: "💎 Total", value: formatMoney(total), inline: true }
      )
      .setFooter({
        text: `Requested by ${message.author.username}`,
      })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
