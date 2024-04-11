import { text } from "@fortawesome/fontawesome-svg-core";
import fetch from "node-fetch";

const DiscordMessageSend = (type, message) => {
  /*const webhookUrl =
    "https://discord.com/api/webhooks/1156887494843973692/ejQif5hw-4V3xMzKq-HscflTrhZRiv0FtqtsVq0tK3c_l9mEKciOSKFzmAdY9m2A3m5H";*/
  const webhookUrl =
    "https://discord.com/api/webhooks/1159604974808993823/C3AJCNmyvCt-LzmqMIWoVdi3UlV9JIyLAU8FX982vG_kj40yAQ-KuUL86C1FpKXPb5Y1";

  const requestBodyTxt = {
    content: "通知：" + message,
    username: "システムメッセージ",
    avatar_url: "https://example.com/path/to/img.png"
  };

  const requestBodyImg = {
    username: "システムメッセージ",
    avatar_url: "https://example.com/path/to/img.png",
    content: "画像がアップロードされました‼",
    embeds: [
      {
        thumbnail: {
          url: message
        }
      }
    ]
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: type === "text" ? JSON.stringify(requestBodyTxt) : type === "img" ? JSON.stringify(requestBodyImg) : undefined
  })
    .then(response => {
      console.log(response.status);
      console.log(response.statusText);
    })
    .catch(error => {
      console.error("Error sending webhook:", error);
    });
};

export default DiscordMessageSend;
