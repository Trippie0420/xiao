const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const math = require('mathjs');
const operations = ['+', '-', '*'];

module.exports = class MathGameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mathgame',
            group: 'games',
            memberName: 'mathgame',
            description: 'See how fast you can answer a math problem in a given time limit.',
            args: [{
                key: 'difficulty',
                prompt: 'What should the difficulty of the math game be? `Easy`, `Medium`, `Hard`, `Extreme`, or `Impossible`?',
                type: 'string',
                validate: difficulty => {
                    if (['easy', 'medium', 'hard', 'extreme', 'impossible'].includes(difficulty.toLowerCase()))
                        return true;
                    return 'Please set the difficulty to either `easy`, `medium`, `hard`, `extreme`, or `impossible`.';
                },
                parse: difficulty => difficulty.toLowerCase()
            }]
        });
    }

    async run(msg, args) {
        if (msg.channel.type !== 'dm')
            if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS'))
                return msg.say('This Command requires the `Embed Links` Permission.');
        const { difficulty } = args;
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let value;
        switch (difficulty) {
            case 'easy':
                value = 10;
                break;
            case 'medium':
                value = 50;
                break;
            case 'hard':
                value = 100;
                break;
            case 'extreme':
                value = 1000;
                break;
            case 'impossible':
                value = 10000;
                break;
        }
        const value1 = Math.floor(Math.random() * value) + 1;
        const value2 = Math.floor(Math.random() * value) + 1;
        const expression = `${value1} ${operation} ${value2}`;
        const solved = math.eval(expression).toString();
        const embed = new RichEmbed()
            .setTitle('You have **10** seconds to answer:')
            .setDescription(expression);
        await msg.embed(embed);
        try {
            const collected = await msg.channel.awaitMessages(res => res.author.id === msg.author.id, {
                max: 1,
                time: 10000,
                errors: ['time']
            });
            if (collected.first().content !== solved)
                return msg.say(`Aw... Too bad, try again next time!\nThe correct answer is: ${solved}`);
            return msg.say(`Good Job! You won! ${solved} is the correct answer!`);
        } catch (err) {
            return msg.say(`Aw... Too bad, try again next time!\nThe correct answer is: ${solved}`);
        }
    }
};
