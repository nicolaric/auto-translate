import { config } from "../../config/config.js";

export function track(message) {
    const botToken = config("TELEGRAM_API_TOKEN");
    fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${config("TELEGRAM_CHAT_ID")}&text=${message}`,
    );
}
