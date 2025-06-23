require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

// Webhook 路由
app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    const results = await Promise.all(
      events.map(async (event) => {
        if (event.type === "message" && event.message.type === "text") {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `👉 你的訊息是：${event.message.text}`,
          });
        }
      })
    );
    res.json(results);
  } catch (err) {
    console.error("錯誤發生：", err);
    res.status(500).end();
  }
});

// 啟動伺服器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ LINE Webhook server 已啟動：port ${port}`);
});
