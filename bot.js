const TelegramBot = require('node-telegram-bot-api');
const config = require("./config.json").bot;

// TOKEN && ULANISH 
const token = config.token;
const bot = new TelegramBot(token, { polling: true });

// on start
bot.onText(/\/start/, require("./events/on.start.js"));

//on message
bot.on("message", require("./events/on.mesage.js"));

//on query
bot.on("callback_query", require("./events/on.callback.query.js"));

//on inline query
bot.on('inline_query', require("./events/on.inline.query.js"));

//on contact
bot.on("contact", require("./events/on.contact.js"));

//on callback_query
bot.on("polling_error", (err) => {
    console.log("TGB: ./app/bot.js.. 25 rows");
});

// exports bot 
module.exports = bot