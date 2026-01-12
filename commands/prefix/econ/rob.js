/**
 * Command: rob
 * Description: Attempt to rob another user
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

const COOLDOWN = 2 * 60 * 60 * 1000; // 2 hours

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

module.exports = {
  name: "rob",
  description: "Attempt to rob another user.",

  async execute(message) {
    const target = message.mentions.users.first();
    if (!target) {
      return message.reply("❌ You must mention someone to rob.");
    }

    if (target.bot || target.id === message.author.id) {
      return message.reply("❌ You cannot rob that user.");
    }

    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    // 🆕 Create accounts if missing
    if (!economy[message.author.id]) {
      economy[message.author.id] = {
        wallet: 10000,
        bank: 0,
        lastRob: 0,
      };
    }

    if (!economy[target.id]) {
      economy[target.id] = {
        wallet: 10000,
        bank: 0,
      };
    }

    const robber = economy[message.author.id];
    const victim = economy[target.id];
    const now = Date.now();

    // ⏳ Cooldown
    if (robber.lastRob && now - robber.lastRob < COOLDOWN) {
      const hours = Math.ceil(
        (COOLDOWN - (now - robber.lastRob)) / 3600000
      );
      return message.reply(
        `⏳ You must wait **${hours} hour(s)** before robbing again.`
      );
    }

    // ❌ Victim too poor
    if (victim.wallet < 500) {
      return message.reply("❌ This user has nothing worth stealing.");
    }

    robber.lastRob = now;

    const chance = Math.random();
    let embed;

    if (chance < 0.45) {
      // ✅ SUCCESS
      const stolen = Math.floor(
        Math.random() * Math.min(victim.wallet, 3000)
      ) + 200;

      victim.wallet -= stolen;
      robber.wallet += stolen;

      embed = new EmbedBuilder()
        .setColor("#00ff99")
        .setTitle("🕵️ Robbery Successful!")
        .setDescription(
          `You stole **${formatMoney(stolen)}** from **${target.username}** 😈`
        );
    } else if (chance < 0.75) {
      // ❌ FAIL
      embed = new EmbedBuilder()
        .setColor("#ffaa00")
        .setTitle("❌ Robbery Failed")
        .setDescription(
          `You failed to rob **${target.username}** and escaped empty-handed.`
        );
    } else {
      // 🚔 CAUGHT
      const fine = Math.min(robber.wallet, 2000);
      robber.wallet -= fine;

      embed = new EmbedBuilder()
        .setColor("#ff4444")
        .setTitle("🚔 Caught!")
        .setDescription(
          `You were caught robbing **${target.username}**!\nYou paid a fine of **${formatMoney(
            fine
          )}** 💸`
        );
    }

    fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));

    embed
      .setFooter({ text: "Crime doesn’t pay… or does it? 👑" })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
