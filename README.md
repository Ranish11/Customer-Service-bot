# 🤖 CustomBot – Smart AI Chatbot for Any Website

**CustomBot** is an intelligent chatbot that can answer user queries based on live content fetched directly from any website URL.  
No need for manual datasets or pre-training — just drop a link and start chatting!

---

## 🚀 Key Highlights

- 🌐 Live scraping of web content in real-time  
- 🧠 Smart LLM responses powered by Groq + LLaMA 4  
- ⚡ Instant Q&A based on any website’s data  
- ❌ No data preparation or training required  
- 🧱 Full-stack build with React, Node.js, Express & Puppeteer

---

## 📁 Folder Structure

custombot/
├── client/ # React frontend (Vite)
├── server/ # Node.js + Express backend
---

## 🛠️ Tech Stack

| Frontend  | Backend  | AI / Utilities         |
|-----------|----------|------------------------|
| React     | Node.js  | Groq API (LLaMA 4)     |
| Vite      | Express  | Puppeteer              |
| Axios     |          |                        |

---

## ⚙️ Getting Started
cd client && npm install
cd ../server && npm install
GROQ_KEY=your_groq_api_key_here
# From project root:
npm install concurrently
npm run dev

---

##🧠 What It Does
This chatbot scrapes live data from any website using Puppeteer, sends that data to the Groq LLaMA 4 API, and returns contextual answers to user queries — all in real time.

---

##👨‍💻 Author
Built by Ranish T
Open to collaborations, feedback, or improvements — feel free to raise issues or pull requests.
