const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();
const { gameOptions, againOptions } = require("./options");
const token = process.env.TOKEN;

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Я загадаю число от 0 до 9, а ты отгадай");
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => { 
    bot.setMyCommands([
        {command: "/start", description: "Начать"},
        { command: "/info", description: "Информация" },
        { command: "/game", description: "Игра" },
    ]);

    bot.on("message", async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === "/start") { 
            await bot.sendMessage(chatId, "Привет, это бот");
            return bot.sendSticker(chatId, "CAACAgIAAxkBAAIctmSIwIXErJi5_WAULICgNCUzx4VLAAImGgACmajIS0DvEn-GtzdqLwQ");
        };
        if (text === "/info") { 
            return bot.sendMessage(chatId, "Какая-то инфа о боте");
        };
        if (text === "/game") { 
            return startGame(chatId);
        };
        await bot.sendMessage(chatId, "Я тебя не понимаю");
        return bot.sendSticker(chatId, "CAACAgIAAxkBAAIcyGSIwJeVYuvAhVZicMMibzmWbr_lAALaIQAChVZ5SqdvbPPIjxwjLwQ");
    });

    bot.on("callback_query", async msg => { 
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === "/again") { 
            return startGame(chatId);
        };       
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions);
        } else { 
            return bot.sendMessage(chatId, `Неверно, бот загадал ${chats[chatId]}`, againOptions);
        };
    })
};

start();