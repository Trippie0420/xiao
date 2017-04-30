const { Command } = require('discord.js-commando');
const songs = require('./songs');

module.exports = class VocaloidCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'vocaloid',
            group: 'randomimg',
            memberName: 'vocaloid',
            description: 'Sends a random VOCALOID song.'
        });
    }

    run(msg) {
        const song = songs[Math.floor(Math.random() * songs.length)];
        return msg.say(song);
    }
};
