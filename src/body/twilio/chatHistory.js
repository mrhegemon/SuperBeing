import { postgres } from "../postgres.js";

export function getDbKey(chatId, messageId) {
    return 'twilio.' + chatId + '.' + messageId
}
export async function getChatHistory(chatId, length) {
    return await postgres.getInstance.getHistory(length, 'twilio', chatId)
}

export async function addMessageToHistory(chatId, senderName, content, messageId) {
    postgres.getInstance.addMessageInHistory('twilio', chatId, messageId + '', senderName, content)
}