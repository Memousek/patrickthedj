const { SlashCommandBuilder, inlineCode } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("API weather test command")
        .addStringOption(option =>
            option.setName("location")
                .setDescription("The location for weather information")
                .setRequired(true)
        ),
    async execute(interaction) {
        const weatherApiKey = process.env.WEATHER_TOKEN;

        try {
            const cityName = interaction.options.getString("location") || "Prague";
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}`);
            const weatherDescription = response.data.weather[0].description;
            const temperatureCelsius = (response.data.main.temp - 273.15).toFixed(2); // Convert temperature to Celsius and round to two decimal places

            // Calculate the epoch time for the automatic time counter
            const uptime = Date.now() - (Math.round(process.uptime()) * 1000);
            const botuptime = `<t:${(uptime - (uptime % 1000)) / 1000}:R>`;

            // Check Discord.js dependency version
            const packageJSON = require("../../package.json");

            const botembed = new EmbedBuilder()
                .setAuthor({ name: interaction.client.user.tag + " - Bot Info", iconURL: interaction.client.user.displayAvatarURL() })
                .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
                .setColor(client.config.embedColour)
                .setTitle("Patrick the DJ Information")
                .addFields(
                    { name: "Location", value: `${cityName}`, inline: true },
                    { name: "Weather", value: weatherDescription, inline: true },
                    { name: "Temp", value: temperatureCelsius + "°C", inline: true },
                )
                .setTimestamp()
                .setFooter({ text: `/test - ${interaction.client.user.tag}` });

            interaction.reply({ embeds: [botembed], components: [] });
        } catch (error) {
            console.error("Error fetching weather information:", error);
            interaction.reply("Error fetching weather information.");
        }
    }
};
