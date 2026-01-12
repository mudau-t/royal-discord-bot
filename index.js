const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const { logInfo, logWarn, logError } = require("./utils/logger");

// Load environment variables
dotenv.config();

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Collection to store commands
client.commands = new Collection();

/**
 * =========================
 * 📌 LOAD PREFIX COMMANDS (RECURSIVE ✅)
 * =========================
 */
const prefixCommandsPath = path.join(__dirname, "commands/prefix");

function loadPrefixCommands(folderPath) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      // 🔁 Go inside subfolders (IMPORTANT)
      loadPrefixCommands(fullPath);
    } else if (file.endsWith(".js")) {
      const command = require(fullPath);

      if (command.name && typeof command.execute === "function") {
        client.commands.set(command.name, command);
        logInfo(`✅ Loaded prefix command: ${command.name}`);
      } else {
        logWarn(`⚠️ Invalid prefix command file: ${fullPath}`);
      }
    }
  }
}

if (fs.existsSync(prefixCommandsPath)) {
  loadPrefixCommands(prefixCommandsPath);
}

/**
 * =========================
 * 🖱 LOAD CONTEXT MENU COMMANDS
 * =========================
 */
const contextCommandsPath = path.join(__dirname, "commands/context");
if (fs.existsSync(contextCommandsPath)) {
  const contextCommandFiles = fs
    .readdirSync(contextCommandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of contextCommandFiles) {
    const command = require(path.join(contextCommandsPath, file));
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      logWarn(`⚠️ Context command ${file} is missing "data" or "execute".`);
    }
  }
}

/**
 * =========================
 * ⚡ LOAD SLASH COMMANDS
 * =========================
 */
const slashCommandsPath = path.join(__dirname, "commands/slash");
if (fs.existsSync(slashCommandsPath)) {
  const commandFolders = fs.readdirSync(slashCommandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(slashCommandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(path.join(folderPath, file));

      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        logWarn(`⚠️ Slash command ${file} is missing "data" or "execute".`);
      }
    }
  }
}

/**
 * =========================
 * 📡 LOAD EVENTS
 * =========================
 */
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

/**
 * =========================
 * 🛑 ERROR HANDLING
 * =========================
 */
client.on("error", (error) => {
  logError(`❌ Discord client error: ${error}`);
});

client.on("shardError", (error) => {
  logError(`❌ WebSocket error: ${error}`);
});

client.on("rateLimit", (info) => {
  logWarn(`⚠️ Rate limit hit: ${JSON.stringify(info)}`);
});

client.on("guildCreate", (guild) => {
  const botMember = guild.members.me;
  if (!botMember) return;

  const missingPermissions = botMember.permissions.missing([
    "ViewChannel",
    "SendMessages",
    "EmbedLinks",
  ]);

  if (missingPermissions.length > 0) {
    logWarn(
      `⚠️ Missing permissions in "${guild.name}": ${missingPermissions.join(
        ", "
      )}`
    );
  }
});

// Catch crashes
process.on("uncaughtException", (error) => {
  logError(`❌ Uncaught Exception: ${error}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logError(`❌ Unhandled Rejection: ${reason}`);
});

/**
 * =========================
 * 🚀 BOT LOGIN
 * =========================
 */
client
  .login(process.env.DISCORD_BOT_TOKEN)
  .then(() => logInfo("✅ Bot started successfully!"))
  .catch((err) => logError(`❌ Login failed: ${err}`)); 
