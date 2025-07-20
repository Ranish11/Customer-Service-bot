import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import Chat from "./Chat";
import axios from "axios";

const App = () => {
  const [chatItem, setChatItem] = useState();
  const [chatInp, setChatInp] = useState({
    url: "",
    query: "",
  });

  const handleSend = async () => {
    const newchat = { query: chatInp.query };
    const updatedChat = [...(chatItem || []), newchat];
    setChatItem(updatedChat); // Show user query instantly
    const tempChatInp = chatInp;
    setChatInp({ ...chatInp, query: "" });

    try {
      // const res = await axios.post( import.meta.env.VITE_BACKEND_API, tempChatInp);
      const res = await axios.post(
        `http://${window.location.hostname}:4000/chat`,
        tempChatInp
      );
      const reply = res.data.reply;

      // Create a new array with the last item updated
      const updatedWithReply = [...updatedChat];
      updatedWithReply[updatedWithReply.length - 1] = {
        ...updatedWithReply[updatedWithReply.length - 1],
        reply,
      };

      setChatItem(updatedWithReply); // Trigger re-render with reply
    } catch (error) {
      console.error("❌ Error:", error);

      const updatedWithError = [...updatedChat];
      updatedWithError[updatedWithError.length - 1] = {
        ...updatedWithError[updatedWithError.length - 1],
        reply: "❌ Failed to get a reply from server.",
      };

      setChatItem(updatedWithError);
    }
  };

  return (
    <div className="w-full min-h-dvh bg-neutral-900 text-white flex flex-col space-y-3 relative max-w-4xl mx-auto">
      <div className="sticky top-0 left-0 bg-neutral-950 ">
        <nav className="border-b p-2">
          <div className="text-center mx-auto space-y-1 font-bold">
            <h1 className="text-2xl uppercase">Custom Bot</h1>
            <h3 className="text-xs italic text-gray-300">
              "chatbot for customer support"
            </h3>
          </div>
        </nav>
        <section className="flex space-x-5 p-3 items-center rounded-xl">
          <h3 className="font-bold">URL: </h3>
          <input
            type="text"
            value={chatInp.url}
            onChange={(e) => setChatInp({ ...chatInp, url: e.target.value })}
            placeholder="URL for the site"
            className="border w-full p-2 rounded-xl"
          />
        </section>
      </div>
      {chatItem ? (
        <Chat chatItem={chatItem} />
      ) : (
        <div className="flex-1 text-gray-400 flex w-full h-full items-center justify-center">
          <h3>Enter the Site URL and ask your queries</h3>
        </div>
      )}
      <section className="flex space-x-5 p-3 items-center border-t rounded-xl sticky bottom-0 left-0 bg-neutral-950">
        <textarea
          rows={3}
          type="text"
          value={chatInp.query}
          onChange={(e) => setChatInp({ ...chatInp, query: e.target.value })}
          placeholder="Ask Something..."
          className="border w-full p-2 rounded-xl"
        />
        <button
          className="p-3 bg-neutral-700 rounded-full flex cursor-pointer"
          onClick={handleSend}
        >
          <h3 className="m-auto">
            <IoSend size={20} />
          </h3>
        </button>
      </section>
    </div>
  );
};

export default App;
