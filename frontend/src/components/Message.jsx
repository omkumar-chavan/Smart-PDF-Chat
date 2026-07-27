function Message({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-3`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-xl ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-white border"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default Message;