require("dotenv").config();

module.exports = {
  app: {
    token: process.env.TOKEN,
    playing: "/play | DEV Mode 👽",
    global: true,
    guild: "1239135898612924438",
    extraMessages: false,
    loopMessage: false,
    lang: "cs",
    enableEmojis: true,
    botName: "Paprik <🌶️>",
  },

  emojis: {
    back: "⏪",
    skip: "⏩",
    ResumePause: "⏯️",
    savetrack: "💾",
    volumeUp: "🔊",
    volumeDown: "🔉",
    loop: "🔁",
  },

  opt: {
    DJ: {
      enabled: false,
      roleName: "",
      commands: [],
    },
    Translate_Timeout: 10000,
    maxVol: 100,
    spotifyBridge: true,
    volume: 75,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 30000,
    leaveOnEnd: false,
    leaveOnEndCooldown: 30000,
    discordPlayer: {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    },
  },
};
