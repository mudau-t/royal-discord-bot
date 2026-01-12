/**
 * Command: buy
 * Usage: .buy <item name>
 */

const fs = require("fs");
const path = require("path");

const economyPath = path.join(__dirname, "../../../data/economy.json");
const inventoryPath = path.join(__dirname, "../../../data/inventory.json");

// SAME shop list as shop.js (IMPORTANT)
const shopItems = [
  { name: "Wooden Sword", price: 500 },
  { name: "Iron Sword", price: 5000 },
  { name: "Diamond Sword", price: 25000 },
  { name: "Royal Armor", price: 150000 },
  { name: "Private Island", price: 1000000 },
  { name: "Luxury Mansion", price: 5000000 }
];

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

module.exports = {
  name: "buy",
  description: "Buy an item from the shop",

  async execute(message, args) {
    if (!args.length) {
      return message.reply("❌ Usage: `.buy <item name>`");
    }

    const itemName = args.join(" ").toLowerCase();
    const item = shopItems.find(i => i.name.toLowerCase() === itemName);

    if (!item) {
      return message.reply("❌ That item does not exist.");
    }

    // Load economy
    let economy = {};
    if (fs.existsSync(economyPath)) {
      economy = JSON.parse(fs.readFileSync(economyPath, "utf8"));
    }

    if (!economy[message.author.id]) {
      economy[message.author.id] = { wallet: 10000, bank: 0 };
    }

    if (economy[message.author.id].wallet < item.price) {
      return message.reply(
        `❌ You need ${formatMoney(item.price)} to buy **${item.name}**`
      );
    }

    // Deduct money
    economy[message.author.id].wallet -= item.price;
    fs.writeFileSync(economyPath, JSON.stringify(economy, null, 2));

    // Load inventory
    let inventory = {};
    if (fs.existsSync(inventoryPath)) {
      inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
    }

    if (!inventory[message.author.id]) {
      inventory[message.author.id] = [];
    }

    inventory[message.author.id].push(item.name);
    fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));

    message.reply(
      `✅ You bought **${item.name}** for ${formatMoney(item.price)}`
    );
  }
}; 
