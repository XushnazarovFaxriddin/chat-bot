onStart = async (client) => {
    const bot = require('../bot.js');
    const {getAsync,allAsync,runAsync} = require('../db-functions/runSql.js');
    const {updatePhoneNumberAsync,updateRoleAsync,updateFirstnameAsync,updateLastnameAsync,updateUsernameAsync, updateStepAsync} = require('../db-functions/UpdateUsers.js');

    const chatId = client.chat.id;
    const text = client.text;
    const fromId = client.from.id;
    const username = client.from.username;
    await bot.sendMessage(chatId, "Assalomu alaykum, botimizga xush kelibsiz!");
    await bot.sendMessage(chatId, "Tizimdan foydalanish uchun avval ro'yhatdan o'ting!");
    await updateStepAsync(chatId, 1);
    if(username){
        await updateUsernameAsync(chatId, username);
    }
    return await bot.sendMessage(chatId, 'Iltimos ismingizni kiriting!');
}

const errorHandler = require('./error.handle.js');
module.exports = async (msg) => await errorHandler(msg, onStart);