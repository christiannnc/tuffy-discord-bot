/* const spamCheck = (msg, userSet) => {
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
                let muteRole =  msg.guild.roles.cache.find((role) => {role.name === 
                "muted"});

                // check if the user already has the mute role
                if(!msg.member.roles.cache.has(muteRole.id)) {
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

module.exports = spamCheck; */