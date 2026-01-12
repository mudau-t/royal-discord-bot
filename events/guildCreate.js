/**
 * Event: guildCreate
 * Triggered when the bot is added to a new server.
 */
const { logInfo } = require("../utils/logger");
const PREFIX = process.env.DISCORD_BOT_PREFIX;

module.exports = {
  name: "guildCreate",
  execute(guild) {
    logInfo(`➕ Joined new server: ${guild.name} (${guild.id})`);
    guild.systemChannel?.send(
      `Hello! Thanks for inviting me to your server. I wish to make my presents the most important. Use \`${PREFIX}menu\` to get started!.use \`${PREFIX}support fore more info about me`
    );
  },
};
