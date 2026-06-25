import { Command } from "commander";
const program = new Command();

type TelegramResponse = {
  ok: boolean;
  result: {
    message_id?: number;
  };
  description?: string;
};

program
  .name("sendkit")
  .description("A CLI tool for string manipulation")
  .version("1.0.0");

program
  .command("telegram")
  .description("Send a message to a Telegram bot")
  .argument("<chatId>", "Chat ID to send the message to")
  .argument("<message>", "Message to send")
  .action(async (chatId: string, message: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error(
        "Error: TELEGRAM_BOT_TOKEN environment variable is not set.",
      );
      process.exit(1);
    }
    if (!chatId) {
      console.error("Error: Chat ID is not set.");
      process.exit(1);
    }
    if (!message) {
      console.error("Error: Message is not set.");
      process.exit(1);
    }
    console.log(`Sending message "${message}" to chat ID ${chatId}`);
    // Here you would implement the logic to send the message to the Telegram bot

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          }),
        });
        const data: TelegramResponse = await response.json();
        if (!data.ok) {
          console.error("Error sending message:", data.description);
          process.exit(1);
        }

        const messageId = data.result.message_id;
        console.log(`Message sent successfully! Message ID: ${messageId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        process.exit(1);
      }

    process.exit(1);
  });

// Parse the arguments passed by the user
program.parseAsync(process.argv);
