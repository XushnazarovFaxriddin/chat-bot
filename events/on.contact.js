onContact = async (msg) =>{
    // console.log("contCT:",msg);
    const bot = require('../bot.js');
    const {updatePhoneNumberAsync, updateStepAsync} = require('../db-functions/UpdateUsers.js');
    const {getAsync} = require('../db-functions/runSql.js');

    const chatId = msg.chat.id;
    const phoneNumber = msg.contact.phone_number;
    const user = await getAsync("SELECT * FROM Users WHERE chat_id = ?", [chatId]);
    if(user.step === 3 && user.chat_id == msg.contact.user_id){
        await updatePhoneNumberAsync(chatId, phoneNumber);
        await updateStepAsync(chatId, 4);
        await bot.sendMessage(chatId, 'Iltimos kim ekanligingizni tanlang!', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "👨‍🎓 Talaba",
                            callback_data: "talaba"
                        },
                        {
                            text: "👨‍🏫 Xodim",
                            callback_data: "xodim"
                        },
                        {
                            text: "👨‍💻 Fuqaro",
                            callback_data: "fuqaro"
                        }
                    ]
                ]
            }
        });
        let m = await bot.sendMessage(chatId, 'loading ...', {
            reply_markup: {
                remove_keyboard: true
            }
        });
        return await bot.deleteMessage(chatId, m.message_id);
    }
}

const errorHandler = require('./error.handle.js');
module.exports = async (msg) => await errorHandler(msg, onContact);