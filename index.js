
// - Declaration des dépendences
const Captcha = require("@haileybot/captcha-generator");
const Discord = require("discord.js")
fs = require("fs"),
  path = require("path");
// - Declaration du captcha
let captcha = new Captcha();
captcha.PNGStream.pipe(fs.createWriteStream(path.join(__dirname, `${captcha.value}.png`)));

// - Declaration du Client
const client = new Discord.Client()

// - Declaration de tout ce qui serra utile
const logsid = "744326517915648091"
const captchaID = "744326517131182111"
const rolename = "Arrivant pixa"
const owner = "654754795336237058" 


client.on('ready', () => console.log(`Connecté en tant que ${client.user.tag}`));

client.on('message', async message => {
  if(message.channel.id !== captchaID) return;
  if(message.content === "!verifmsg") {
    message.delete()
    if (message.author.id !== owner) return;
    let embed = new Discord.MessageEmbed()
    .setTitle(`Bienvenue sur ${message.guild.name} !`)
    .setDescription(`Afin d'avoir accès au reste du serveur merci de faire **!verif** et de remplir le captcha.
    **Si le captcha ne fonctionne pas merci de dm un membre du staff.**`)
    .setFooter("Captcha-bot par Ethan.")
    message.channel.send(embed)
  }
   if(message.content === "!verif") {
    message.delete()
    let captcha = new Captcha();
    var captchamsg = await message.channel.send(
      "**Veuillez entré le texte de l'image si dessous:**",
      new Discord.MessageAttachment(captcha.PNGStream, "captcha.png")
    )
    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id);
    
    collector.on("collect", m => {
      if (m.content.toUpperCase() === captcha.value) {
        m.delete()
        captchamsg.delete()
          message.channel.send("Vous avez passez la verifications !").then(msg => {
            msg.delete({ timeout: 10000 })
          })
          .catch(console.error);
          // - Ajout du role
          let role = message.guild.roles.cache.find(r => r.name === rolename)
          let member = message.guild.member(message.author);
          message.guild.member(member).roles.add(role)
          // - Logs
          let logs = new Discord.MessageEmbed()
          .setTitle("Captcha logs")
          .setDescription(`<${message.author.id}> a passé la verif, je lui ai donné le role (son id : ${message.author.id})`)
          .setTimestamp()
      client.channels.cache.get(logsid).send(logs)
      }
      else {
        m.delete(), captchamsg.delete(), message.channel.send("Verifications échoué.").then(msg => {
        msg.delete({ timeout: 10000 })
      })
      .catch(console.error);
      // - Logs
      let logs = new Discord.MessageEmbed()
      .setTitle("Captcha logs")
      .setDescription(`<@${message.author.id}> a échoué la verif (son id : ${message.author.id})`)
      .setTimestamp()
      client.channels.cache.get(logsid).send(logs)
    }
      collector.stop();
      
    })
}

}); 



client.login("T0K3N")