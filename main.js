const { Player } = require("discord-player");
const { Client, GatewayIntentBits } = require("discord.js");
const { DefaultExtractors } = require("@discord-player/extractor");

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  disableMentions: "everyone",
});

client.config = require("./config");

const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || require("./config").YOUTUBE_API_KEY, // Přidání YouTube API klíče
  }
});

// Správná registrace extractorů
(async () => {
  try {
    await player.extractors.loadMulti(DefaultExtractors); // Pouze DefaultExtractors
    console.log("Extractors byly úspěšně registrovány!");
  } catch (error) {
    console.error("Chyba při registraci extractorů:", error);
  }
})();

//console.clear();
require("./loader");

client.login(client.config.app.token).catch(async (e) => {
  if (e.message === "An invalid token was provided.") {
    require("./process_tools").throwConfigError(
      "app",
      "token",
      "\n\t   ❌ Invalid Token Provided! ❌ \n\tchange the token in the config file\n"
    );
  } else {
    console.error(
      "❌ An error occurred while trying to login to the bot! ❌ \n",
      e
    );
  }
});
