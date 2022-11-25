const Discord = require("discord.js");
const dotenv = require("dotenv");
const keepAlive = require("./server");

dotenv.config();

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on("ready", () => {
    console.log("The bot is ready");
})

// bot code
const commands = {
    "rescind": "Your admissions decision is unlikely to be rescinded due to a couple of bad grades in your current semester.",
    "wrongchannel": "Please make sure to post in the correct channel!",
    "cosc": "The Code of Student Conduct (COSC) is still upheld outside of the classroom. Please refrain from cheating on assignments or violating the COSC in other ways. This includes receiving or giving unauthorized help on assignments.",
    "roles": "You can change your roles in the appropriate channels on the sidebar. Simply react to the messages in those channels to give yourself a role.",
    "moreinfo": "In order to answer your question other members need enough details. Make sure to include relevant details in your question.",
    "spoonfeeding": "Refrain from spoonfeeding others answers to questions on their assignments. You are welcome to assist others by explaining concepts, providing feedback, giving hints, or asking questions. However, students are encouraged to do as much of the work on their assignments as possible.",
    "selling": "Use the marketplace channel for selling your personal items that you're looking to get rid of.",
    "surveys": "Use the survey channel to post surveys for other members to respond to.",
    "ask": "Members should make an attempt to solve assignment problems on their own before asking for help from others in the server.",
    "safety": "As much as we want members to create friendships with other members, please refrain from sharing sensitive information in this server. Things like your address, phone number, or email address are considered sensitive and should be sent in a direct message rather than this server.",
    "cowjoke": ["Why do cows have hooves instead of feet? Because they lactose", "What do you call a cow with only one leg? Steak", "How does a farmer count cows? With a cowculator", "What do you call a cow with two legs? Your mom", "What do you call a cow with four legs? A cow", "Why is the murder rate among cows so high? They all got beef"],
    "ping": "pong!",
    "ohdamn": "oh damn!",
    "pain": "pain",
    "joke": "joke",
    "gopack": "gopack",
    "panik": "panik",
}

const set = new Set();
// when a message is made check if it's a bot command
client.on("messageCreate", async (message) => {
    const spamCheck = (msg, userSet) => {
        if(msg.member.roles.cache.find((role)=> {role.name === "muted"})) {
            return;
        }

        const user = {id: msg.author.id, time: Date.now(), times: 1}
        let bool = false
        // loop through the set to see if the user who sent the message is in the set
        for(u of userSet) {
            if(u.id === msg.author.id) {
                //user is in the set
                bool = true
                if(u.times == 5) {
                    msg.reply("Woah, too fast! You're being muted to prevent spam. You will be unmuted in 4 minutes.");
                    msg.author.send("Hey there! You've been muted from The Pack server for a few minutes to prevent spam. This happens if you send too many messages within a short period of time. If you have questions about this, feel free to reach out to one of the moderators!")
                    let muteRole =  process.env.ROLE_ID.toString();
    
                    // check if the user already has the mute role
                    if(!msg.member.roles.cache.has(muteRole)) {
                        msg.member.roles.add(muteRole);
    
                        setTimeout(()=> {
                            msg.member.roles.remove(muteRole);
                            userSet.delete(u);
                        }, 240000)
                    }
                } else if((Date.now() - u.time) <= 3000) {
                    u.times++;
                    u.time = Date.now();
                }
            }
        }
        if(bool === false) {
            userSet.add(user);
        }
    }
    spamCheck(message, set);

    if(!message.content.startsWith("!!")) {
        return;
    } else {
        const requestedCommand = message.content.substring(2);
        const messageChannel = message.channel;
        const userId = message.author.id;
        
        // check if the command exists
        if(!commands[requestedCommand]) {
            return
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
              break
            case "spoonfeeding":
              messageChannel.send(commands.spoonfeeding);
              break;
            case "selling":
              messageChannel.send(commands.selling);
              break;
            case "surveys":
              messageChannel.send(commands.surveys);
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
                const randomJoke = Math.floor(Math.random() * (6 - 0 + 1) + 0);
                messageChannel.send(commands.cowjoke[randomJoke]);
                break;
            case "ohdamn":
              // send the file
              const file01 = new Discord.MessageAttachment('./constants/ohdamn.jpeg');
              messageChannel.send({files: [file01]});
              break;
            case "pain":
                const file02 = new Discord.MessageAttachment("./constants/pain_all_i_feel.jpeg");
                messageChannel.send({files: [file02] });
              break;
            case "joke":
                const file03 = new Discord.MessageAttachment("./constants/over_your_head.jpeg");
                messageChannel.send({files: [file03] })
                break;
            case "gopack":
                const file04 = new Discord.MessageAttachment("https://c.tenor.com/GvpvXkPEnjYAAAAd/nc-state-wolf-pack.gif")
                messageChannel.send({files: [file04] });
                break;
            case "panik":
                const file05 = new Discord.MessageAttachment("./constants/panik.jpeg");
                messageChannel.send({ files: [file05] });
                break;
            case "hydrate":
                const file06 = new Discord.MessageAttachment("./constants/carl_hydrate.jpeg");
                messageChannel.send({files:[file06]})
                break;
          }
        }
    }
})

keepAlive();
client.login(process.env.TOKEN)