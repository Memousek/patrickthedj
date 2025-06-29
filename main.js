const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { SoundCloudExtractor } = require('@discord-player/extractor');
const { Client, GatewayIntentBits, Events, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');
const { addSpeechEvent } = require('discord-speech-recognition');
const googleTTS = require('google-tts-api');
const https = require('https');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

// Constants
const MAX_CONVERSATION_HISTORY = 10;
const RANDOM_RESPONSE_CHANCE = 0.0001;
const STOP_TRIGGERS = ['jardo přestaň', 'jardo stop', 'jardo ticho', 'jardo zmlkni', 'jardo drž hubu'];

// State management
const state = {
  conversationHistory: {},
  userSwearCount: {},
  globalAudioPlayer: null
};

// Utility functions
const utils = {
  getDisplayName: (username, mode = 'nominative') => {
    const nameMap = require('./users.json').users;
    return (nameMap[username] || { nominative: username, vocative: username })[mode];
  },

  ordinalCz: (n) => {
    const map = {
      1: 'poprvé', 2: 'podruhý', 3: 'potřetí', 4: 'počtvrtý',
      5: 'popátý', 6: 'pošestý', 7: 'posedmý', 8: 'poosmý', 9: 'podevátý',
      10: 'podesátý', 11: 'pojedenáctý', 12: 'podvanáctý', 13: 'potřináctý',
      14: 'počtrnáctý', 15: 'popatnáctý', 16: 'pošestnáctý',
      17: 'stačilo', 18: 'nech toho', 19: 'stop it už', 20: 'drž hubu',
    };
    return map[n] || `po ${n}.`;
  }
};

// API functions
const api = {
  async askOllama(prompt, guildId, username) {
    if (!state.conversationHistory[guildId]) {
      state.conversationHistory[guildId] = [];
    }

    state.conversationHistory[guildId].push({ role: 'user', content: `${username}: ${prompt}` });
    
    if (state.conversationHistory[guildId].length > MAX_CONVERSATION_HISTORY) {
      state.conversationHistory[guildId].shift();
    }

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma3:12b',
          stream: false,
          messages: [
            { role: 'system', content: 'Odpovídej do jedné max dvou vět.' },
            ...state.conversationHistory[guildId]
          ]
        }),
      });

      const data = await response.json();
      const reply = data.message?.content ?? 'Ticho po pěšině.';

      state.conversationHistory[guildId].push({ role: 'assistant', content: reply });
      if (state.conversationHistory[guildId].length > MAX_CONVERSATION_HISTORY) {
        state.conversationHistory[guildId].shift();
      }

      return reply;
    } catch (err) {
      console.error('❌ Chyba při parsování JSON:', err);
      return 'Mozek selhal.';
    }
  },

  async getWeather(city = 'Praha') {
    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
      return await res.text();
    } catch (e) {
      return 'Počasí se mi nepodařilo zjistit, kámo.';
    }
  }
};

// Voice functions
const voice = {
  async playTTS(connection, text, lang = 'cs-CZ') {
    try {
      const urls = await googleTTS.getAllAudioUrls(text, {
        lang,
        slow: false,
        splitPunct: ',.?!;，。？、！',
      });

      const audioPlayer = createAudioPlayer();
      connection.subscribe(audioPlayer);

      for (const { url } of urls) {
        const stream = await new Promise((resolve, reject) => {
          https.get(url, res => resolve(res)).on('error', reject);
        });

        const resource = createAudioResource(stream, {
          inputType: StreamType.Arbitrary,
        });

        audioPlayer.play(resource);
        await new Promise(resolve => {
          audioPlayer.once(AudioPlayerStatus.Idle, resolve);
        });
      }

      audioPlayer.stop();
    } catch (error) {
      console.error('Error in playTTS:', error);
    }
  },

  getOrCreateConnection(channel, guild) {
    return getVoiceConnection(guild.id) || joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });
  }
};

// Initialize Discord client
global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  disableMentions: 'everyone',
});

client.config = require('./config');

// Initialize player
const player = new Player(client, client.config.opt.discordPlayer);
player.extractors.register(YoutubeiExtractor, {});
player.extractors.register(SoundCloudExtractor, {});

// Add speech recognition
addSpeechEvent(client, { lang: 'cs-CZ' });

// Event handlers
client.on(Events.MessageCreate, async message => {
  if (!message.guild || message.author.bot) return;

  if (message.content === '!join') {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply('Musíš být ve voice kanálu.');

    const connection = voice.getOrCreateConnection(channel, message.guild);
    await voice.playTTS(connection, 'Ocholera e to Fredy Fazber. Ou ou ou ou ou.');
  }
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  if (!oldState.channelId && newState.channelId && !newState.member.user.bot) {
    const connection = voice.getOrCreateConnection(newState.channel, newState.guild);
    const name = utils.getDisplayName(newState.member.user.username, 'vocative');
    await voice.playTTS(connection, `Nazdar ${name}, vítej mezi námi.`);
  }
});

client.on('speech', async (msg) => {
  if (!msg.content || !msg.author) return;
  const content = msg.content.toLowerCase();
  console.log(`[${msg.author.username}]: ${content}`);

  const connection = voice.getOrCreateConnection(msg.member.voice.channel, msg.guild);

  if (Math.random() < RANDOM_RESPONSE_CHANCE) {
    await voice.playTTS(connection, 'To je pravda.');
  }

  // Handle specific commands
  if (content.includes('nazdar kamarádi') || content.includes('nazdar kamaráde')) {
    return await voice.playTTS(connection, 'Nazdar kamaráde, dneska nás odvezeš do Salieryho baru.');
  }

  if (content.includes('blbe kecy')) {
    return await voice.playTTS(connection, 'Tum tum tum tum sahur');
  }

  if (content.includes('dobrou noc') || content.includes('gn') || content === 'gn!') {
    const name = utils.getDisplayName(msg.author.username, 'vocative');
    return await voice.playTTS(connection, `Dobrou noc, ${name}, spi sladce.`);
  }

  // Handle weather queries
  const weatherMatch = content.match(/jak.*počas[ií](?:\s+v\s+(.+))?/);
  if (weatherMatch) {
    const city = weatherMatch[1] || 'Praha';
    const weather = await api.getWeather(city);
    return await voice.playTTS(connection, weather);
  }

  // Handle Jardo queries
  if (content.includes('jardo')) {
    const prompt = content.replace(/jardo/gi, '').trim();
    const reply = await api.askOllama(prompt, msg.guild.id, msg.author.username);
    return await voice.playTTS(connection, reply);
  }

  // Handle stop commands
  if (STOP_TRIGGERS.some(t => content.includes(t))) {
    if (state.globalAudioPlayer) state.globalAudioPlayer.stop(true);
    return;
  }
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Přihlášen jako ${client.user.tag}`);
});

// Error handling for login
client.login(client.config.app.token).catch(async (e) => {
  if (e.message === 'An invalid token was provided.') {
    require('./process_tools').throwConfigError('app', 'token', '\n\t   ❌ Invalid Token Provided! ❌ \n\tChange the token in the config file\n');
  } else {
    console.error('❌ An error occurred while trying to login to the bot! ❌ \n', e);
  }
});

console.clear();
require('./loader');
