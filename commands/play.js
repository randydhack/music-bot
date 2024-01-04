const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song")
        .addSubcommand(subcommand => {
            subcommand
                .setName("search")
                .setDescription("Searches for a song")
                .addStringOption(option => {
                    option
                        .setName("searchterms")
                        .setDescription("search keywords")
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            subcommand
                .setName("playlist")
                .setDescription("Plays playlist from YT")
                .addStringOption(option => {
                    option
                        .setName("url")
                        .setDescription("playlist url")
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            subcommand
                .setName('song')
                .setDescription("Plays song from YT")
                .addStringOption(option => {
                    option
                        .setName("searchterms")
                        .setDescription('search keywords')
                        .setRequired(true)
                })
        })
}
