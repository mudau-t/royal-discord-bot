/**
 * Command: leaderboard
 * Aliases: lb, top
 * Description: Shows the richest users
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

module.exports = {
  name: "leaderboard",
  aliases: ["lb", "top"],
  description: "View the richest users leaderboard.",

  async execute(message) {
    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    // 🧮 Build leaderboard data
    const leaderboard = Object.entries(economy)
      .map(([userId, data]) => ({
        userId,
        total: (data.wallet || 0) + (data.bank || 0),
      }))
      .filter((u) => u.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    if (!leaderboard.length) {
      return message.reply("❌ No economy data found.");
    }

    let description = "";

    for (let i = 0; i < leaderboard.length; i++) {
      const user = await message.client.users
        .fetch(leaderboard[i].userId)
        .catch(() => null);

      if (!user) continue;

      const medal =
        i === 0 ? "🥇" :
        i === 1 ? "🥈" :
        i === 2 ? "🥉" :
        `#${i + 1}`;

      description +=
        `${medal} **${user.username}**\n` +
        `💰 ${formatMoney(leaderboard[i].total)}\n\n`;
    }

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("👑 Royal Economy Leaderboard")
      .setDescription(description)
      .setFooter({
        text: `Requested by ${message.author.username}`,
      })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
}; 
