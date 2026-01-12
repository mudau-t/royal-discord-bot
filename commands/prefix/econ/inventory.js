/**
 * Command: inventory
 * Aliases: inv, bag
 * Description: View your inventory or another user's inventory
 */

const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const economyPath = path.join(__dirname, "../../../data/economy.json");

module.exports = {
  name: "inv",
  aliases: ["inv", "bag"],
  description: "View your inventory or another user's inventory.",

  async execute(message) {
    // 👤 Target user
    const user = message.mentions.users.first() || message.author;

    // 📂 Load economy data
    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    // 🆕 Create account if missing
    if (!economy[user.id]) {
      economy[user.id] = {
        wallet: 10000,
        bank: 0,
        inventory: {},
      };
    }

    // 🆕 Ensure inventory exists
    if (!economy[user.id].inventory) {
      economy[user.id].inventory = {};
    }

    fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));

    const inventory = economy[user.id].inventory;
    const items = Object.keys(inventory);

    // 🎒 Empty inventory
    if (items.length === 0) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#5865f2")
            .setTitle("🎒 Inventory")
            .setDescription(`${user.username} has no items yet.`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: "Buy items from the shop to fill your inventory" })
            .setTimestamp(),
        ],
      });
    }

    // 📦 Build inventory list
    const inventoryList = items
      .map((item) => `• **${item}** × ${inventory[item]}`)
      .join("\n");

    // 🎨 Embed
    const embed = new EmbedBuilder()
      .setColor("#5865f2")
      .setTitle("🎒 Inventory")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setDescription(inventoryList)
      .setFooter({ text: `Requested by ${message.author.username}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
}; 
