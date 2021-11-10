const { Client, Intents } = require('discord.js');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const fs = require('fs')

let cfg = {}

const commands = {}

if(fs.existsSync("./cfg.json"))
    cfg = JSON.parse(fs.readFileSync("./cfg.json").toString())



bot.login(cfg.token)

bot.on('ready', ()=>{
    loadCommands("./cmds");
    console.log('\nBot ready');
})

bot.on('message', msg=>{
    if(msg.author.bot || msg.channel.type != "text") return;
    let prefix = cfg.prefix;
   
    if(msg.content.startsWith(cfg.prefix))
    {
        let cmdLine = msg.content.slice(cfg.prefix.length, msg.content.length);
        let cmd = cmdLine;
       
        if(cmdLine.indexOf(' ') != -1)
        {
            cmd = cmdLine.slice(0,cmdLine.indexOf(' '));
          
            // args = cmdLine.slice(cmdLine.indexOf(' '), cmdLine.length);
        }
        for(let cname in commands){
           
            if(cname == cmd)
            {
                let args = cmdLine.slice(cname.length+1).split(' ').filter(Boolean);
                
                commands[cname].run(bot, msg, args);
            }
        }
    }
});

function loadCommands(path)
{
    console.log('loading commands...');
    const files = fs.readdirSync(path).filter(f=> f.endsWith('.js'));
    files.forEach(file => {
        const cname = file.toLowerCase().substring(0, file.length-3);
        const command = require(path + "/" + file);
        commands[cname] = command;
        console.log(`* ${file} loaded - command ${cname}`)
    });
    console.log('commands successfully loaded');
}