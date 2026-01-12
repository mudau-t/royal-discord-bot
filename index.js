const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const { logInfo, logWarn, logError } = require("./utils/logger");

dotenv.config();

/* =========================
   🤖 DISCORD CLIENT
========================= */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

/* =========================
   📦 COMMAND COLLECTIONS
========================= */
client.prefixCommands = new Collection();   // REQUIRED
client.slashCommands = new Collection();
client.contextCommands = new Collection();

/* =========================
   📌 LOAD PREFIX COMMANDS
========================= */
const prefixCommandsPath = path.join(__dirname, "commands/prefix");

function loadPrefixCommands(folderPath) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadPrefixCommands(fullPath);
      continue;
    }

    if (!file.endsWith(".js")) continue;

    const command = require(fullPath);

    if (!command?.name || typeof command.execute !== "function") {
      logWarn(`⚠️ Invalid prefix command skipped: ${fullPath}`);
      continue;
    }

    // main command
    client.prefixCommands.set(command.name, command);

    // aliases
    if (Array.isArray(command.aliases)) {
      for (const alias of command.aliases) {
        client.prefixCommands.set(alias, command);
      }
    }

    logInfo(`✅ Loaded prefix command: ${command.name}`);
  }
}

if (fs.existsSync(prefixCommandsPath)) {
  loadPrefixCommands(prefixCommandsPath);
} else {
  logWarn("⚠️ Prefix commands folder not found");
}

/* =========================
   🖱 LOAD CONTEXT COMMANDS
========================= */
const contextCommandsPath = path.join(__dirname, "commands/context");

if (fs.existsSync(contextCommandsPath)) {
  for (const file of fs.readdirSync(contextCommandsPath)) {
    if (!file.endsWith(".js")) continue;

    const command = require(path.join(contextCommandsPath, file));
    if (command?.data?.name && typeof command.execute === "function") {
      client.contextCommands.set(command.data.name, command);
      logInfo(`✅ Loaded context command: ${command.data.name}`);
    }
  }
}

/* =========================
   ⚡ LOAD SLASH COMMANDS
========================= */
const slashCommandsPath = path.join(__dirname, "commands/slash");

if (fs.existsSync(slashCommandsPath)) {
  for (const folder of fs.readdirSync(slashCommandsPath)) {
    const folderPath = path.join(slashCommandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    for (const file of fs.readdirSync(folderPath)) {
      if (!file.endsWith(".js")) continue;

      const command = require(path.join(folderPath, file));
      if (command?.data?.name && typeof command.execute === "function") {
        client.slashCommands.set(command.data.name, command);
        logInfo(`✅ Loaded slash command: ${command.data.name}`);
      }
    }
  }
}

/* =========================
   📡 LOAD EVENTS
========================= */
const eventsPath = path.join(__dirname, "events");

for (const file of fs.readdirSync(eventsPath)) {
  if (!file.endsWith(".js")) continue;

  const event = require(path.join(eventsPath, file));

  if (!event?.name || typeof event.execute !== "function") {
    logWarn(`⚠️ Invalid event skipped: ${file}`);
    continue;
  }

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

/* =========================
   🛑 GLOBAL ERROR HANDLING
========================= */
client.on("error", err => logError(err));
client.on("shardError", err => logError(err));

process.on("uncaughtException", err => {
  logError(`❌ Uncaught Exception: ${err.stack || err}`);
});

process.on("unhandledRejection", reason => {
  logError(`❌ Unhandled Rejection: ${reason}`);
});

/* =========================
   🚀 LOGIN
========================= */
client.login(process.env.DISCORD_BOT_TOKEN)
  .then(() => logInfo("✅ Bot logged in successfully"))
  .catch(err => logError(`❌ Login failed: ${err}`));

/* =========================
   🔗 EXPORT CLIENT (IMPORTANT)
========================= */
module.exports = client;
