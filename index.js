
// - Declaration des dépendences
const captchagen = require("captchagen")
const Discord = require("discord.js")
fs = require("fs"),
  path = require("path");


// - Declaration du Client
const client = new Discord.Client()

// - Declaration de tout ce qui serra utile
const logsid = "744326517915648091"




client.on('ready', () => console.log(`Connecté en tant que ${client.user.tag}`));

client.on('guildMemberAdd', async member => {
  // - Declaration du channel logs
  const channel = member.guild.channels.cache.find(channel => channel.name === "captcha");
  // - Calcule de la date
  let day = member.user.createdAt.getDate()
        let month = 1 + member.user.createdAt.getMonth()
        let year = member.user.createdAt.getFullYear()
        function checkDays(date) {
          let now = new Date();
          let diff = now.getTime() - date.getTime();
          let days = Math.floor(diff / 86400000);
          return `Il y a ${days +(days == 1 ? " jour" : " jours")}`
      }
      // - Logs de join
                    let embed = new Discord.MessageEmbed()
                    .setTitle(`Nouveau membre :`)
                    .setDescription(`<:warn:716637815433199617> | ${member.user.tag} (${member.id}) viens de rejoindre le serveur ! Son compte a été créer le : \`${day}/${month}/${year}\` (${checkDays(member.guild.createdAt)})`)
                    .setColor(`#ff4f02`)
                    client.channels.cache.get(logsid).send(embed)
                

                // Declaration du captcha
                var captcha = captchagen.create();
                captcha.text();
                captcha.height();
                captcha.width();  
                captcha.generate();
                let attachment = new Discord.MessageAttachment(captcha.buffer(), "captcha.png");
                let filter = (m) => m.author.id === member.id,
                opt = { max: 1, time: 120000, errors: [ "time" ] };
                member.guild.channels.cache.forEach((channel) => {
                    channel.updateOverwrite(member.id, {
                        VIEW_CHANNEL: false,
                    }).catch((err) => {});
                });
               channel.updateOverwrite(member.id, {
                    VIEW_CHANNEL: true,
                }).catch((err) => {});
                let msg = await channel.send(`<:warn:716637815433199617> | Veuillez compléter le catpcha pour avoir accès au serveur ! *Vous avez **2 minutes !*** ${member}`, attachment)
                
                let collected = await channel.awaitMessages(filter, opt).catch(() => {});
                if(!collected || !collected.first()) {
                    msg.delete()
                    member.kick("Captcha non rempli")
                
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Captcha mal rempli :`)
                        .setColor(`#ff0000`)
                        .setDescription(`<:error:716095023971565679> ${member.user.tag} (${member.id}) viens d'être kick car il a mal/pas rempli son captcha !`)
                        client.channels.cache.get(logsid).send(embed)
                    
                }
                let messagecontent = collected.first().content;
                collected.first().delete();

                if(messagecontent.toLowerCase() === captcha.text()){
                    msg.delete()
                  
                  
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Captcha rempli :`)
                        .setColor(`#09ff00`)
                        .setDescription(`${member.user.tag} (${member.id}) viens de remplir son captcha !`)
                        client.channels.cache.get(logsid).send(embed)
                    
                    
                        member.guild.channels.cache.forEach(channel => channel.updateOverwrite(member.id, { 
                    VIEW_CHANNEL: null,}
                ));
                channel.updateOverwrite(member.id, {
                    VIEW_CHANNEL: false,
                }).catch((err) => {});
                } else {
                    msg.delete()
                    member.kick("Captcha non rempli")
            
          
                        let embed = new Discord.MessageEmbed()
                        .setTitle(`Captcha mal rempli :`)
                        .setColor(`#ff0000`)
                        .setDescription(`<:error:716095023971565679> ${member.user.tag} (${member.id}) viens d'être kick car il a mal/pas rempli son captcha !`)
                        client.channels.cache.get(logsid).send(embed)

                    
                  }

                  });



client.login("T0K3N")
