/**
 * Command: work
 * Description: Work to earn money
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

const COOLDOWN = 60 * 60 * 1000; // 1 hour
const MIN_EARN = 500;
const MAX_EARN = 3000;

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

function randomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const jobs = [
  "Royal Guard",
  "Castle Cleaner",
  "Merchant",
  "Blacksmith",
  "Knight Trainer",
  "Messenger",
  "Royal Chef",
  "Treasurer",
];

module.exports = {
  name: "work",
  description: "Work to earn money.",

  async execute(message) {
    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    // 🆕 Create account if missing
    if (!economy[message.author.id]) {
      economy[message.author.id] = {
        wallet: 10000, // 👑 Starting money
        bank: 0,
        lastWork: 0,
      };
    }

    const userData = economy[message.author.id];
    const now = Date.now();

    // ⏳ Cooldown check
    if (userData.lastWork && now - userData.lastWork < COOLDOWN) {
      const timeLeft = COOLDOWN - (now - userData.lastWork);
      const minutes = Math.ceil(timeLeft / 60000);

      return message.reply(
        `⏳ You must wait **${minutes} minutes** before working again.`
      );
    }

    const earned = randomAmount(MIN_EARN, MAX_EARN);
    const job = jobs[Math.floor(Math.random() * jobs.length)];

    userData.wallet += earned;
    userData.lastWork = now;

    fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));

    const embed = new EmbedBuilder()
      .setColor("#00ff99")
      .setTitle("👑 Royal Work")
      .setDescription(
        `You worked as a **${job}** and earned **${formatMoney(earned)}** 💼`
      )
      .addFields({
        name: "💰 New Wallet Balance",
        value: formatMoney(userData.wallet),
      })
      .setFooter({ text: "Come back in 1 hour to work again!" })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
}; 
