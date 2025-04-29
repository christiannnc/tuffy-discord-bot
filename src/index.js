const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once('ready', () => {
  console.log('Bot is online!');
});

const responses = {
  wrongchannel: 'Please make sure to post in the correct channel!',
  cosc: 'The Code of Student Conduct (COSC) is still upheld outside of the classroom. Please refrain from cheating on assignments or violating the COSC in other ways. This includes receiving or giving unauthorized help on assignments.',
  moreinfo:
    'In order to answer your question other members need enough details. Make sure to include relevant details in your question.',
  spoonfeeding:
    'Refrain from spoonfeeding others answers to questions on their assignments. You are welcome to assist others by explaining concepts, providing feedback, giving hints, or asking questions. However, students are encouraged to do as much of the work on their assignments as possible.',
  ask: 'Members should make an attempt to solve assignment problems on their own before asking for help from others in the server.',
  safety:
    'As much as we want members to create friendships with other members, please refrain from sharing sensitive information in this server. Things like your address, phone number, or email address are considered sensitive and should be sent in a direct message rather than this server.',
  cowjoke: [
    'Why do cows have hooves instead of feet? Because they lactose',
    'What do you call a cow with only one leg? Steak',
    'How does a farmer count cows? With a cowculator',
    'What do you call a cow with four legs? A cow',
  ],
  ping: 'pong!',
  pain: 'pain',
  gopack: 'gopack',
};

const activeUsers = new Map();

client.on('messageCreate', (message) => {
  if (message.author.bot) {
    return;
  }

  handleSpam(message);

  if (!message.content.startsWith('!!')) {
    return;
  }

  const command = message.content.slice(2).toLowerCase();
  const reply = responses[command];

  if (reply) {
    if (Array.isArray(reply)) {
      const randomIdx = Math.floor(Math.random() * reply.length);
      message.channel.send(reply[randomIdx]);
    } else {
      message.channel.send(reply);
    }
  }
});

const handleSpam = (msg) => {
  const { author, member } = msg;
  const { roles } = member;

  if (roles.cache.some((role) => role.name === 'muted')) {
    return;
  }

  const userActivity = activeUsers.get(author.id);
  console.log(userActivity);
  if (userActivity) {
    if (userActivity.times == 5) {
      msg.reply(
        "Woah, too fast! You're being muted to prevent spam. You will be unmuted in 4 minutes."
      );
      author.send(
        "Hey there! You've been muted from The Pack server for a few minutes to prevent spam. This happens if you send too many messages within a short period of time. If you have questions about this, feel free to reach out to one of the moderators!"
      );

      const muteRole = process.env.ROLE_ID;

      if (!roles.cache.has(muteRole)) {
        roles.add(muteRole);

        setTimeout(() => {
          roles.remove(muteRole);
          activeUsers.delete(u);
        }, 240000);
      }
    } else if (Date.now() - userActivity.time <= 3000) {
      userActivity.times++;
      userActivity.time = Date.now();
    }

    return;
  }

  activeUsers.set(author.id, { id: msg.author.id, time: Date.now(), times: 1 });
};

client.login(process.env.TOKEN);
