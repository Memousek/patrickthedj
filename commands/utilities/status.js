const { SlashCommandBuilder, inlineCode } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Return Patrick's status!"),
    async execute(interaction) {
        //Calculate the epoch time for automatic time counter
        var uptime = Date.now() - (Math.round(process.uptime()) * 1000),
            botuptime = `<t:${(uptime-(uptime%1000)) / 1000}:R>`,
            weatherApiResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Praha&appid=${process.env.WEATHER_TOKEN}`),
            weatherApiStatus = weatherApiResponse.status === 200 ? "Online" : "Offline",
            version = String(process.env.DEVMODE) == "true" ? "Dev version" : "Version";

        //Check Discord.js dependency version
        const packageJSON = require("../../package.json");

        const botembed = new EmbedBuilder()
        .setAuthor({ name: interaction.client.user.tag + " - Bot Info", iconURL: interaction.client.user.displayAvatarURL() })
        .setThumbnail(interaction.client.user.displayAvatarURL({dynamic: true}))
        .setColor(client.config.embedColour)
        .setTitle("Patrick's Status")
        .addFields(
            { name: "Process", value: `${((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2)} MB\nNJS - v${process.versions.node}\nDJS - v${packageJSON.dependencies["discord.js"]}\nDiscord Player - v${packageJSON.dependencies["discord-player"]}`, inline: true },
            { name: "Ping", value: `API - ${Math.round(interaction.client.ws.ping)}ms`, inline: true },
            { name: "Uptime Since", value: botuptime, inline: true },
            { name: "Weather API", value: weatherApiStatus, inline: true },
            { name: version, value: process.env.VERSION, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: `/status - ${interaction.client.user.tag}` })

        var actionbuttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setURL(`http://memousek.eu/`)
            .setStyle(5) //Link
            .setLabel("👌 Web"),
            //.addOptions(options)
        )

        interaction.reply({ embeds: [botembed], components: [actionbuttons] });
    }
}