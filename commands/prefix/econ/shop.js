/**
 * Command: shop
 * Description: View the royal shop
 */

const { EmbedBuilder } = require("discord.js");

function formatMoney(amount) {
  return `R${amount.toLocaleString("en-ZA")}`;
}

const shopItems = [
  // 🟢 NORMAL ITEMS
  { name: "🍞 Bread", price: 500, desc: "Simple food" },
  { name: "🍎 Apple", price: 800, desc: "Fresh fruit" },
  { name: "🧃 Juice", price: 1200, desc: "Sweet drink" },
  { name: "🎟️ Lottery Ticket", price: 2000, desc: "Try your luck" },
  { name: "🧤 Gloves", price: 2500, desc: "Warm hands" },
  { name: "🧢 Cap", price: 3000, desc: "Royal style" },
  { name: "📱 Old Phone", price: 4500, desc: "Still works" },
  { name: "🚲 Bicycle", price: 7000, desc: "Travel faster" },
  { name: "🎮 Game Console", price: 9500, desc: "Entertainment" },
  { name: "⌚ Watch", price: 12000, desc: "Time is money" },
  { name: "💍 Ring", price: 15000, desc: "Shiny item" },
  { name: "👕 Royal Outfit", price: 18000, desc: "Look rich" },
  { name: "🏠 Small House", price: 30000, desc: "Your first home" },
  { name: "🚗 Used Car", price: 50000, desc: "Old but gold" },
  { name: "🏍️ Motorbike", price: 75000, desc: "Speed!" },

  // 🔴 VERY EXPENSIVE ITEMS (15)
  { name: "🏎️ Sports Car", price: 250000, desc: "Fast & flashy" },
  { name: "🛥️ Speed Boat", price: 400000, desc: "Luxury travel" },
  { name: "🏰 Small Castle", price: 750000, desc: "Royal living" },
  { name: "🛩️ Private Jet", price: 1200000, desc: "Fly like a king" },
  { name: "💎 Diamond Vault", price: 2000000, desc: "Pure wealth" },
  { name: "🏝️ Private Island", price: 3500000, desc: "Your own land" },
  { name: "👑 Golden Crown", price: 5000000, desc: "True royalty" },
  { name: "🛡️ Legendary Armor", price: 7500000, desc: "Invincible" },
  { name: "⚔️ Mythic Sword", price: 9000000, desc: "Power weapon" },
  { name: "🐉 Dragon Egg", price: 12000000, desc: "Rare creature" },
  { name: "🏦 Mega Bank", price: 20000000, desc: "Control money" },
  { name: "🌌 Space Station", price: 35000000, desc: "Beyond Earth" },
  { name: "🪐 Planet Deed", price: 50000000, desc: "Own a planet" },
  { name: "⏳ Time Machine", price: 75000000, desc: "Break reality" },
  { name: "👁️ God Relic", price: 100000000, desc: "Unlimited power" },
];

module.exports = {
  name: "shop",
  description: "View the royal shop.",

  execute(message) {
    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setTitle("👑 Royal Shop")
      .setDescription(
        shopItems
          .map(
            (item, i) =>
              `**${i + 1}. ${item.name}**\n💰 ${formatMoney(
                item.price
              )}\n_${item.desc}_`
          )
          .join("\n\n")
      )
      .setFooter({
        text: "Use .buy <item number>",
      })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
}; 
