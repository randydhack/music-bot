const {SlashCommandBuilder } = require("@discordjs/builders");
const { Embed, EmbedBuilder } = require("discord.js");
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song")
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription("Searches for a song")
                .addStringOption(option =>
                    option
                        .setName("searchterms")
                        .setDescription("search keywords")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription("Plays playlist from YT")
                .addStringOption(option =>
                    option
                        .setName("url")
                        .setDescription("playlist url")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('song')
                .setDescription("Plays song from YT")
                .addStringOption(option =>
                    option
                        .setName("searchterms")
                        .setDescription('search keywords')
                        .setRequired(true)
                )
        ),
    execute: async ({client, interaction}) => {
        if (!interaction.member.voice.channel) {
            await interaction.reply("You must be in voice channel to use this command.")
            return;
        }

        const queue = await client.player.nodes.create(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder();

        if (interaction.options.getSubcommand() === 'song') {
            let url = interaction.options.getString("url")

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            })

            if (result.tracks.length === 0) {
                await interaction.reply("no results found");
                return;
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`})

        } else if (interaction.options.getSubcommand() === 'playlist') {
            let url = interaction.options.getString('url')

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            })

            if (result.tracks.length === 0) {
                await interaction.reply("no playlist found");
                return;
            }

            const playlist = result.playlist;
            await queue.addTrack(playlist);

            embed
                .setDescription(`Added **[${playlist.title}](${playlist.url})** to the queue.`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: `Duration: ${playlist.duration}`})
        } else if (interaction.options.getSubcommand() === 'searchterms') {
            let url = interaction.options.getString('url')

            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_AUTO,
            })

            if (result.tracks.length === 0) {
                await interaction.reply("no results found");
                return;
            }

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`})
        }

        if (!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        })
    }
}
