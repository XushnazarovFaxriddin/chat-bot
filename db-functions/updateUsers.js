const { getAsync,runAsync } = require('./runSql.js');

async function updatePhoneNumberAsync(chatId, phoneNumber) {
    chatId = Number(chatId);
    phoneNumber = phoneNumber.toString();
    let sql = "SELECT COUNT(*) as count FROM Users WHERE chat_id = ?";
    let data = await getAsync(sql, [chatId]);
    if (data.count === 0) {
        sql = `INSERT INTO Users (chat_id, phone_number) VALUES (?, ?)`;
        return await runAsync(sql, [chatId, phoneNumber]);
    } else {
        sql = `UPDATE users SET phone_number = ? WHERE chat_id = ?`;
        return await runAsync(sql, [phoneNumber, chatId]);
    }
}

async function updateRoleAsync(chatId, role) {
    chatId = Number(chatId);
    role = role.toString();
    let sql = "SELECT COUNT(*) as count FROM Users WHERE chat_id = ?";
    let data = await getAsync(sql, [chatId]);
    if (data.count === 0) {
        sql = `INSERT INTO Users (chat_id, role) VALUES (?, ?)`;
        return await runAsync(sql, [chatId, role]);
    } else {
        sql = `UPDATE users SET role = ? WHERE chat_id = ?`;
        return await runAsync(sql, [role, chatId]);
    }
}

async function updateFirstnameAsync(chatId, firstname) {
    chatId = Number(chatId);
    firstname = firstname.toString();
    let sql = "SELECT COUNT(*) as count FROM Users WHERE chat_id = ?";
    let data = await getAsync(sql, [chatId]);
    if (data.count === 0) {
        sql = `INSERT INTO Users (chat_id, firstname) VALUES (?, ?)`;
        return await runAsync(sql, [chatId, firstname]);
    } else {
        sql = `UPDATE users SET firstname = ? WHERE chat_id = ?`;
        return await runAsync(sql, [firstname, chatId]);
    }
}

async function updateLastnameAsync(chatId, lastname) {
    chatId = Number(chatId);
    lastname = lastname.toString();
    let sql = "SELECT COUNT(*) as count FROM Users WHERE chat_id = ?";
    let data = await getAsync(sql, [chatId]);
    if (data.count === 0) {
        sql = `INSERT INTO Users (chat_id, lastname) VALUES (?, ?)`;
        return await runAsync(sql, [chatId, lastname]);
    } else {
        sql = `UPDATE users SET lastname = ? WHERE chat_id = ?`;
        return await runAsync(sql, [lastname, chatId]);
    }
}

async function updateUsernameAsync(chatId, username) {
    chatId = Number(chatId);
    username = username.toString();
    let sql = "SELECT COUNT(*) as count FROM Users WHERE chat_id = ?";
    let data = await getAsync(sql, [chatId]);
    if (data.count === 0) {
        sql = `INSERT INTO Users (chat_id, username) VALUES (?, ?)`;
        return await runAsync(sql, [chatId, username]);
    } else {
        sql = `UPDATE users SET username = ? WHERE chat_id = ?`;
        return await runAsync(sql, [username, chatId]);
    }
}

async function updateStepAsync(chatId, step) {
    chatId = Number(chatId);
    step = parseInt(step);
    let sql = "SELECT COUNT(*) as count FROM Users WHERE chat_id = ?";
    let data = await getAsync(sql, [chatId]);
    if (data.count === 0) {
        sql = `INSERT INTO Users (chat_id, step) VALUES (?, ?)`;
        return await runAsync(sql, [chatId, step]);
    } else {
        sql = `UPDATE users SET step = ? WHERE chat_id = ?`;
        return await runAsync(sql, [step, chatId]);
    }
}

async function updateIsPrivateAsync(chatId, isPrivate){
    if(isPrivate == true)
        isPrivate = 1
    else if(isPrivate == false)
        isPrivate = 0
    let sql = "SELECT COUNT(*) as count FROM Users WHERE chat_id = ?";
    let data = await getAsync(sql, [chatId]);
    if(data.count === 0){
        sql = `INSERT INTO Users (chat_id, is_private) VALUES (?, ?)`;
        return await runAsync(sql, [chatId, isPrivate]);
    }else{
        sql = `UPDATE Users SET is_private = ? WHERE chat_id = ?`;
        return await runAsync(sql, [isPrivate, chatId]);
    }
}



module.exports = {
     updatePhoneNumberAsync 
    ,updateRoleAsync
    ,updateFirstnameAsync
    ,updateLastnameAsync
    ,updateUsernameAsync
    ,updateStepAsync
    ,updateIsPrivateAsync
};