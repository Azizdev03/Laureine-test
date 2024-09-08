const axios = require('axios');

let lastResponseMessageID = null;

async function handleCommand(api, event, args, message) {
    try {
        const question = args.join(" ").trim();

        if (!question) {
            return message.reply("Coucou, moi c’est Laureine, pour te servir 😊.");
        }

        const { response, messageID } = await getAIResponse(question, event.senderID, event.messageID);
        lastResponseMessageID = messageID;

        api.sendMessage(`Laureine\n━━━━━━━━━━━━━━━━\n ➭ ❝ ${response} ❞\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);
    } catch (error) {
        console.error("Error in handleCommand:", error.message);
        message.reply("An error occurred while processing your request.");
    }
}

async function getAnswerFromAI(question) {
    try {
        const API = [
            'https://api.kenliejugarap.com/gptgo/?text=${question}'
        ];

        for (const service of services) {
            const data = await fetchFromAI(API);
            if (data) return data;
        }

        throw new Error("No valid response from any AI service");
    } catch (error) {
        console.error("Error in getAnswerFromAI:", error.message);
        throw new Error("Failed to get AI response");
    }
}

async function fetchFromAI(API) {
    try {
        const { data } = await axios.get(API);
        if (data && (data.gpt4 || data.reply || data.response || data.answer || data.message)) {
            const response = data.gpt4 || data.reply || data.response || data.answer || data.message;
            console.log("AI Response:", response);
            return response;
        } else {
            throw new Error("No valid response from AI");
        }
    } catch (error) {
        console.error("Network Error:", error.message);
        return null;
    }
}

async function getAIResponse(input, userId, messageID) {
    const query = input.trim() || "hi";
    try {
        const response = await getAnswerFromAI(query);
        return { response, messageID };
    } catch (error) {
        console.error("Error in getAIResponse:", error.message);
        throw error;
    }
}

module.exports = {
    config: {
        name: '🤖',
        author: 'coffee',
        role: 0,
        category: 'Ai - chat',
        shortDescription: 'AI to answer any question',
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        try {
            const { response } = await getAIResponse(input, event.senderID, event.messageID);
            api.sendMessage(`Laureine ❤️\n━━━━━━━━━━━━━━━━\n ➭ ❝ ${response} ❞\n━━━━━━━━━━━━━━━━\n YOUR QUESTION: ${input}\n━━━━━━━━━━━━━━━━\n[CATEGORY]: GPT4`, event.threadID, messageID);
        } catch (error) {
            console.error("Error in onStart:", error.message);
            api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    },
    onChat: async function ({ event, message, api }) {
        const messageContent = event.body.trim().toLowerCase();

        // Check if the message is a reply to the bot's message or starts with "ai"
        if ((event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) || (messageContent.startsWith("ai", "teo", "mateo", "ma", "bot", "gpt4", "gpt4o", "chatgpt", "gerald", this.config.name) && event.senderID !== api.getCurrentUserID())) {
            const input = messageContent.replace(/^ai\s*/, "").trim();
            try {
                const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
                lastResponseMessageID = messageID;
                api.sendMessage(`Laureine ❤️\n━━━━━━━━━━━━━━━━\n ➭ ❝ ${response} ❞\n━━━━━━━━━━━━━━━━\n YOUR QUESTION: ${input}\n━━━━━━━━━━━━━━━━\n[CATEGORY]: GPT4`, event.threadID, messageID);
            } catch (error) {
                console.error("Error in onChat:", error.message);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            }
        }
    },
    handleCommand // Export the handleCommand function for command-based interactions
};
