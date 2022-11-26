const Discord = require("discord.js");
const dotenv = require("dotenv");
const keepAlive = require("./server");

dotenv.config();

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
});

client.on("ready", () => {
    console.log("The bot is ready");
});

// bot code
const commands = {
    wrongchannel: "Please make sure to post in the correct channel!",
    cosc: "The Code of Student Conduct (COSC) is still upheld outside of the classroom. Please refrain from cheating on assignments or violating the COSC in other ways. This includes receiving or giving unauthorized help on assignments.",
    moreinfo:
        "In order to answer your question other members need enough details. Make sure to include relevant details in your question.",
    spoonfeeding:
        "Refrain from spoonfeeding others answers to questions on their assignments. You are welcome to assist others by explaining concepts, providing feedback, giving hints, or asking questions. However, students are encouraged to do as much of the work on their assignments as possible.",
    ask: "Members should make an attempt to solve assignment problems on their own before asking for help from others in the server.",
    safety: "As much as we want members to create friendships with other members, please refrain from sharing sensitive information in this server. Things like your address, phone number, or email address are considered sensitive and should be sent in a direct message rather than this server.",
    cowjoke: [
        "Why do cows have hooves instead of feet? Because they lactose",
        "What do you call a cow with only one leg? Steak",
        "How does a farmer count cows? With a cowculator",
        "What do you call a cow with four legs? A cow",
    ],
    ping: "pong!",
    pain: "pain",
    gopack: "gopack",
};

const set = new Set();
// when a message is made check if it's a bot command
client.on("messageCreate", async (message) => {
    const spamCheck = (msg, userSet) => {
        if (
            msg.member.roles.cache.find((role) => {
                role.name === "muted";
            })
        ) {
            return;
        }

        const user = { id: msg.author.id, time: Date.now(), times: 1 };
        let bool = false;
        // loop through the set to see if the user who sent the message is in the set
        for (u of userSet) {
            if (u.id === msg.author.id) {
                //user is in the set
                bool = true;
                if (u.times == 5) {
                    msg.reply(
                        "Woah, too fast! You're being muted to prevent spam. You will be unmuted in 4 minutes."
                    );
                    msg.author.send(
                        "Hey there! You've been muted from The Pack server for a few minutes to prevent spam. This happens if you send too many messages within a short period of time. If you have questions about this, feel free to reach out to one of the moderators!"
                    );
                    let muteRole = process.env.ROLE_ID.toString();

                    // check if the user already has the mute role
                    if (!msg.member.roles.cache.has(muteRole)) {
                        msg.member.roles.add(muteRole);

                        setTimeout(() => {
                            msg.member.roles.remove(muteRole);
                            userSet.delete(u);
                        }, 240000);
                    }
                } else if (Date.now() - u.time <= 3000) {
                    u.times++;
                    u.time = Date.now();
                }
            }
        }
        if (bool === false) {
            userSet.add(user);
        }
    };
    spamCheck(message, set);

    if (!message.content.startsWith("!!")) {
        return;
    } else {
        const requestedCommand = message.content.substring(2);
        const messageChannel = message.channel;

        // check if the command exists
        if (!commands[requestedCommand]) {
            return;
        } else {
            // perform the command
            switch (requestedCommand) {
                case "rescind":
                    messageChannel.send(commands.rescind);
                    break;

                case "wrongchannel":
                    messageChannel.send(commands.wrongchannel);
                    break;
                case "cosc":
                    messageChannel.send(commands.cosc);
                    break;
                case "roles":
                    messageChannel.send(commands.roles);
                    break;
                case "moreinfo":
                    messageChannel.send(commands.moreinfo);
                    break;
                case "spoonfeeding":
                    messageChannel.send(commands.spoonfeeding);
                    break;
                case "ask":
                    messageChannel.send(commands.ask);
                    break;
                case "safety":
                    messageChannel.send(commands.safety);
                    break;
                case "ping":
                    messageChannel.send(commands.ping);
                    break;
                case "cowjoke":
                    const randomJoke = Math.floor(
                        Math.random() * (6 - 0 + 1) + 0
                    );
                    messageChannel.send(commands.cowjoke[randomJoke]);
                    break;
                case "pain":
                    const file02 = new Discord.MessageAttachment(
                        "./constants/pain_all_i_feel.jpeg"
                    );
                    messageChannel.send({ files: [file02] });
                    break;
                case "gopack":
                    const file04 = new Discord.MessageAttachment(
                        "https://c.tenor.com/GvpvXkPEnjYAAAAd/nc-state-wolf-pack.gif"
                    );
                    messageChannel.send({ files: [file04] });
                    break;
            }
        }
    }
});

keepAlive();
client.login(process.env.TOKEN);
