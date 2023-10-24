onCallbackQuery = async (query) => {
    console.log(query);

    const bot = require('../bot.js');
    const { updateRoleAsync, updateStepAsync, updateIsPrivateAsync } = require('../db-functions/UpdateUsers.js');
    const { getAsync } = require('../db-functions/runSql.js');

    const chatId = query.message.chat.id;
    const data = query.data;

    let authSuccessMessage = "🎉 Tabriklaymiz siz ro'yhatdan o'tdingiz!\n" +
        "✍️ Murojaatingizni yozib yuborishingiz mumkin.";
    let isSelected = false;
    let isPrivateSelected = false;
    // Handle the callback based on the data received
    switch (data) {
        case 'talaba':
            await updateRoleAsync(chatId, 'Talaba');
            isSelected = true;
            break;
        case 'xodim':
            await updateRoleAsync(chatId, 'Xodim');
            isSelected = true;
            break;
        case 'fuqaro':
            await updateRoleAsync(chatId, 'Fuqaro');
            isSelected = true;
            break;
        case 'ha':
            updateIsPrivateAsync(chatId, false);
            isPrivateSelected = true;
            break;
        case 'yoq':
            updateIsPrivateAsync(chatId, true);
            isPrivateSelected = true;
            break;
        default:
            await bot.sendMessage(chatId, 'Sizning rolingiz aniqlanmadi!\nIltimos qaytadan urinib ko\'ring yoki /start bosing!');
            break;
    }
    let sql = "SELECT chat_id, role, is_private FROM Users WHERE chat_id = ?";
    let user = await getAsync(sql, [chatId])
    if (user.role && isPrivateSelected) {
        await updateStepAsync(chatId, 5);
        await bot.sendMessage(chatId, authSuccessMessage);
    }
    if (isSelected) {
        await bot.sendMessage(chatId, 'Shaxsingizni oshkor qilinishini xoxlaysizmi?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Ha",
                            callback_data: "ha"
                        },
                        {
                            text: "Yoq",
                            callback_data: "yoq"
                        }
                    ]
                ]
            }
        });
    }
    await bot.deleteMessage(chatId, query.message.message_id);
}
const errorHandler = require('./error.handle.js');
module.exports = async (msg) => await errorHandler(msg, onCallbackQuery);