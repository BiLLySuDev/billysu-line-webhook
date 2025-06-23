require("dotenv").config();
const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

// webhook 接收訊息路由
app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    const results = await Promise.all(
      events.map(async (event) => {
        if (event.type === "message" && event.message.type === "text") {
          return client.replyMessage(event.replyToken, {
            type: "text",
            text: `📨 你說的是：「${event.message.text}」`,
          });
        }
      })
    );
    res.json(results);
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).end();
  }
});

// 主動推播測試用
app.get("/", (req, res) => {
  res.send("✅ BiLLySu Webhook Server Running!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
