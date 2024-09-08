const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🌼 Laureine ❤️ ]";
 
module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang", // 
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "View command usage",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },
 
  onStart: async function ({ message, args, global, event, threadsData, role}) {
  const { threadID } = event;
  const threadData = await threadsData.get(threadID);
  const prefix = getPrefix(threadID);
 
  if (args.length === 0) {
      const categories = {};
      let msg = "";
 
      msg += `╒════╍═══╪═══╍══════╕\n✦✦⇛◍𝕄𝔸𝕋𝔼𝕆 ℂℍ𝔸𝕋𝔹𝕆𝕋◍⇚✦✦\n╘════╍═══╪═══╍══════╛`;
 
      for (const [name, value] of commands) {
          if (value.config.role > 1 && role < value.config.role) continue;
 
          const category = value.config.category || "Uncategorized";
          categories[category] = categories[category] || { commands: [] };
          categories[category].commands.push(name);
      }
8
      Object.keys(categories).forEach(category => {
          if (category !== "info") {
              msg += `\n╭─────『 ${category.toUpperCase()} 』\n`;
 
              const names = categories[category].commands.sort();
              for (let i = 0; i < names.length; i += 1) {
                  const cmds = names.slice(i, i + 1).map(item => ` 🐐${item} `);
                  msg += `${cmds.join(" ".repeat(Math.max(0, 5 - cmds.join("").length)))}`;
              }
 
              msg += `\n╰─────────────⭓`;
          }
      });
 
      const totalCommands = commands.size;
      msg += `\n\n╭──────【 ☘ | ENJOY 】─⭓`
      msg += `\n│ » 𝘊𝘜𝘙𝘙𝘌𝘕𝘛𝘓𝘠, 𝘛𝘏𝘐𝘚 𝘎𝘖𝘈𝘛𝘉𝘖𝘛 𝘏𝘈𝘚 ${totalCommands} 𝘊𝘖𝘔𝘔𝘈𝘕𝘋𝘚 𝘛𝘏𝘈𝘛 𝘊𝘈𝘕 𝘉𝘌 𝘜𝘚𝘌𝘋.\n`;
      msg += `│ » 𝘛𝘠𝘗𝘌 ${prefix}help  (/𝘤𝘮𝘥_𝘯𝘢𝘮𝘦\) 𝘛𝘖 𝘝𝘐𝘌𝘞 𝘋𝘌𝘛𝘈𝘐𝘓𝘚 𝘖𝘍 𝘏𝘖𝘞 𝘛𝘖 𝘜𝘚𝘌 𝘐𝘛 \n`;
      msg += `╰────────────⭓`;
      msg += `\n\n╭────────────⭓`;
      msg += `\n│${doNotDelete}`;
      msg += `\n╰──────────⭓`;
 
 
      await message.reply({
          body: msg,
      });
  } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));
 
      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "GERALD";
 
        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";
 
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);
 
        const response = `╭── NAME ────⭓
  │ ${configCommand.name}
  ├── INFO
  │ Description: ${longDescription}
  │ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  │ Other names in your group: Do not have
  │ Version: ${configCommand.version || "1.0"}
  │ Role: ${roleText}
  │ Time per command: ${configCommand.countDown || 1}s
  │ Author: ${author}
  ├── Usage
  │ ${usage}
  ├── Notes
  │ The content inside <XXXXX> can be changed
  │ The content inside [a|b|c] is a or b or c
  ╰──────────────⭓`;
 
        await message.reply(response);
      }
    }
  },
};
 
function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
	}
