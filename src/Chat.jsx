const Chat = ({ chatItem }) => {
  return (
    <section className="flex-1 h-screen p-4 space-y-5">
      {chatItem.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col w-full space-y-5 p-5 ${
            index > 0 ? "border-t" : ""
          }`}
        >
          <div className="flex flex-col w-full items-end">
            <h3 className="bg-neutral-800 p-2 w-5/6 rounded-xl text-justify">
              {item.query}
            </h3>
          </div>
          <div className="flex flex-col w-full ">
            <h3 className="bg-neutral-800 p-2 w-5/6 rounded-xl text-justify">
              {item.reply || "..."}
            </h3>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Chat;
