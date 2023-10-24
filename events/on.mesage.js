const config = require('../config.json').bot;
const fs = require('fs');
onMessage = async (msg) => {
    // console.log(msg);

    if (msg.text === '/start') return;

    const bot = require('../bot.js');
    const { getAsync, allAsync, runAsync } = require('../db-functions/runSql.js');
    const { updateFirstnameAsync, updateLastnameAsync, updateUsernameAsync, updateStepAsync } = require('../db-functions/UpdateUsers.js');
    let localTime = new Date().toLocaleString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tashkent' });

    if (msg.chat.id == config.group_id && msg.text?.startsWith("/all")) {
        let users = await allAsync("SELECT chat_id, firstname, lastname FROM Users", []);
        let count = 0;
        let notSend = []
        for (let user of users) {
            try {
                await bot.sendMessage(user.chat_id, msg.text.replace("/all", ""));
                count++;
            } catch (e) {
                console.log(e.message);
                notSend.push({
                    chat_id: user.chat_id,
                    firstname: user.firstname,
                    lastname: user.lastname
                });
            }
        }
        let html = `📣 <b>${count}</b> ta foydalanuvchiga habar yetkazildi!\n
❌ <b>${notSend.length}</b> ta foydalanuvchiga habar yuborib bo'lmadi!\n\n`;
        await bot.sendMessage(msg.chat.id, html, { parse_mode: 'HTML' });
        await runAsync("UPDATE Users SET step = 6 WHERE chat_id IN (" + notSend.map(user => user.chat_id).join(",") + ");", []);
        // html = 'Yuborib bo\'lmagan foydanaluvchilar:\n' + notSend.map((user, index) => `${index + 1}. <a href="tg://user?id=${user.chat_id}"><b>${user.firstname} ${user.lastname}</b></a>`).join("\n");
        // return await bot.sendMessage(msg.chat.id, html, { parse_mode: 'HTML' });
        return;
    }

    if (msg.chat?.type?.includes('group')) {
        // console.log('group');
        if (msg.chat.id == config.group_id) {
            let replyMessage = msg.reply_to_message?.text;
            // console.log(replyMessage);
            if (replyMessage) {
                if (!msg.text)
                    return await bot.sendMessage(msg.chat.id, '❌ Iltimos javobingizni matn shaklida yuboring!');
                let data = JSON.parse(replyMessage.split('\n')[0]);
                if (data.chat_id && data.message_id) {
                    try {
                        await runAsync("INSERT INTO Messages (user_id, reply_message_id, message_id, text, date) VALUES (?, ?, ?, ?, ?);", [msg.from.id, data.message_id, msg.message_id, msg.text, localTime]);
                        let murojaat = await getAsync("SELECT text, date FROM Messages WHERE message_id = ?;", [data.message_id]);
                        await bot.sendMessage(data.chat_id, `📤 Murrojaat matni: ${murojaat.text}\n

📥 Javob: <b>${msg.text}</b>

\nMurojaat yuborilgan vaqt: <b>${murojaat.date}</b>
Javob qaytarilgan vaqt: <b>${localTime}</b>`, { parse_mode: 'HTML' });
                        return await bot.sendMessage(msg.chat.id, '✅ Javob yuborildi!');
                    }
                    catch (e) {
                        return await bot.sendMessage(msg.chat.id, '❌ Javob yuborishda xatolik yuz berdi!\nError: ' + e.message);
                    }
                }
            }
        }
        return;
    }

    const chatId = msg.chat.id;
    const text = msg.text;
    const fromId = msg.from.id;
    const username = msg.from.username;

    if (text === '/admin') {
        return await bot.sendMessage(chatId, `👮‍♂️ Bot yaratuvchisi: @${config.admin_username}, @khushnazarov`);
    }
    if (text === '/statistic') {
        const users = await getAsync("SELECT COUNT(chat_id) as count FROM Users;", []);
        const deleteUsers = await getAsync("SELECT COUNT(chat_id) as count FROM Users WHERE step = 6;", []);
        const murojaatlar = await getAsync("SELECT COUNT(DISTINCT message_id) as count FROM Messages WHERE reply_message_id IS NULL;", []);
        const koribChiqilganMurojaatlar = await getAsync("SELECT COUNT(DISTINCT reply_message_id) as count FROM Messages WHERE reply_message_id IS NOT NULL;", []);
        const roles = await allAsync('SELECT role, count(chat_id) as count FROM Users GROUP BY role', []);
        let html = `Jami foydalanuvchilar: <b>${users.count}</b> ta
Jami murojaatlar: <b>${murojaatlar.count}</b> ta
Jami korib chiqilgan murojaatlar: <b>${koribChiqilganMurojaatlar.count}</b> ta
Botdan o\'chirilgan foydalanuvchilar: <b>${deleteUsers.count}</b> ta
Foydalanuvchilar soni rollar bo'yicha:
${roles.map(role => '\t🔹 ' + (role.role ?? 'Aniqlanmagan') + 'lar: ' + role.count + ' ta').join("\n")} 
\nVaqt: ${localTime}`;
        return await bot.sendMessage(chatId, html, { parse_mode: 'HTML' });
    }
    if (text === '/info') {
        return await bot.sendMessage(chatId, `📌 Ushbu bot yordamida siz BMTI rektoriga to'g'ridan-to'g'ri murojaat qilishingiz mumkin!
Ro'yhatdan to'liq o'ting va murojaatingizni yozib yuboring va rektor shaxsan o'zlari sizga vaqt topib javob qaytaradilar.`);
    }
    if (text === '/help') {
        return await bot.sendMessage(chatId, `📌 Botdan foydalanish uchun quyidagi buyruqlardan foydalaning:
/start - Botni ishga tushirish
/info - Bot haqida ma'lumot olish
/help - Botdan foydalanish uchun ko'rsatmalar
/statistic - Bot statistikasini ko'rish
/admin - Bot dasturchisi bilan bog'lanish`);
    }
    if (text === '/db' && username === config.admin_username) {
        const filePath = './db.sqlite3'
        const fileName = `bmti-tg-bot-db.sqlite3`;
        const stream = fs.readFileSync(filePath);
        return await bot.sendDocument(chatId, stream, {
            caption: `database backup: ${localTime}`
        }, {
            filename: fileName,
            contentType: 'application/sqlite3'
        });
    }

    let user = await getAsync("SELECT * FROM Users WHERE chat_id = ?", [chatId]);
    let spoiler = (txt) => `${user.is_private == 1 ? '<span class="tg-spoiler">' : ''}${txt}${user.is_private == 1 ? '</span>' : ''}`;

    if (user.step === 3 && msg.contact) {
        if (msg.contact.user_id !== chatId) {
            return await bot.sendMessage(chatId, '👮‍♂️ Iltimos o\'zingizning telefon raqamingizni yuboring!');
        }
        return;
    }
    if (user.step !== 5 && !msg.text) {
        return await bot.sendMessage(chatId, '👮‍♂️ Kechirasiz siz to\'liq ro\'yhatdan o\'tmadingiz!');
    }

    if (user.step === 1) {
        await updateFirstnameAsync(chatId, text);
        await updateStepAsync(chatId, 2);
        if (username) {
            await updateUsernameAsync(chatId, username);
        }
        return await bot.sendMessage(chatId, 'Iltimos familiyangizni kiriting!');
    }
    if (user.step === 2) {
        await updateLastnameAsync(chatId, text);
        await updateStepAsync(chatId, 3);
        return await bot.sendMessage(chatId, 'Iltimos telefon raqamingizni yuboring! \n\nBu uchun pastdagi <b>"📞 Telefon raqamni yuborish"</b> tugmasini bosing!', {
            reply_markup: {
                keyboard: [
                    [{
                        text: "📞 Telefon raqamni yuborish",
                        request_contact: true
                    }]
                ],
                resize_keyboard: true,
                one_time_keyboard: false
            },
            parse_mode: 'HTML'
        });
    }
    if (user.step === 5) {
        if (text) {
            await runAsync("INSERT INTO Messages (user_id, message_id, text, date) VALUES (?, ?, ?, ?);", [chatId, msg.message_id, text, localTime]);
            let html = `{"message_id":${msg.message_id},"chat_id":${chatId} }
Murojaat qiluvchi: ${spoiler(`<a href="tg://user?id=${user.chat_id}"><b>${user.firstname} ${user.lastname}</b></a>`)}
Role: <b>${user.role}</b>
Tel: ${spoiler(`<b>${user.phone_number}</b>`)}

📩 Murojaat matni: <b>${text}</b>
${user.is_private == 1 ? "\n❗️ <b>Ushbu foydalanuvchining shaxsi oshkor qilinmasin!</b>\n" : ""}
Vaqt: <b>${localTime}</b>`;
            await bot.sendMessage(config.group_id, html, { parse_mode: 'HTML' });
            await bot.sendMessage(chatId, '✅ Murojaatingiz qabul qilindi!');
            return await bot.sendMessage(chatId, '⏳ Sizga tez orada javob qaytaramiz, iltimos kuting!');
        } else {
            return await bot.sendMessage(chatId, '👮‍♂️ Kechirasiz siz murojaatingizni faqat yozma ravishda yuborishingiz mumkin!');
        }
    } else {
        await bot.sendMessage(chatId, '😮 Kechirasiz siz to\'liq ro\'yhatdan o\'tmadingiz!');
        return await bot.sendMessage(chatId, 'Iltimos qayta /start bosing!');
    }
}

const errorHandler = require('./error.handle.js');
module.exports = async (msg) => await errorHandler(msg, onMessage);