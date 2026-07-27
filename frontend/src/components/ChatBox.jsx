import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

function ChatBox({
  messages,
  loading,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto rounded-3xl bg-slate-50 p-6">

      {messages.length === 0 && !loading && (

        <div className="h-full flex flex-col items-center justify-center text-center">

          <div className="bg-blue-100 p-5 rounded-full mb-5">
            <Bot
              size={40}
              className="text-blue-600"
            />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Welcome to Smart PDF Chat
          </h2>

          <p className="text-gray-500 max-w-md">
            Upload a PDF and ask questions about its
            contents. AI will answer using only the
            uploaded document.
          </p>

        </div>

      )}

      <div className="space-y-6">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`flex gap-3 max-w-[80%] ${
                msg.role === "user"
                  ? "flex-row-reverse"
                  : ""
              }`}
            >

              <div
                className={`h-11 w-11 rounded-full flex items-center justify-center ${
                  msg.role === "user"
                    ? "bg-blue-600"
                    : "bg-gray-800"
                }`}
              >
                {msg.role === "user" ? (
                  <User
                    size={20}
                    className="text-white"
                  />
                ) : (
                  <Bot
                    size={20}
                    className="text-white"
                  />
                )}
              </div>

              <div
                className={`rounded-2xl px-5 py-4 shadow ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >

                <p className="font-semibold mb-2 text-sm">
                  {msg.role === "user"
                    ? "You"
                    : "Smart PDF AI"}
                </p>

                <p className="whitespace-pre-wrap leading-7">
                  {msg.text}
                </p>

              </div>

            </div>

          </div>

        ))}

        {loading && (

          <div className="flex">

            <div className="flex gap-3">

              <div className="h-11 w-11 rounded-full bg-gray-800 flex items-center justify-center">

                <Bot
                  size={20}
                  className="text-white"
                />

              </div>

              <div className="bg-white rounded-2xl shadow border px-5 py-4">

                <p className="font-semibold mb-2">
                  Smart PDF AI
                </p>

                <div className="flex gap-2">

                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>

                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>

                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>

                </div>

              </div>

            </div>

          </div>

        )}

        <div ref={bottomRef} />

      </div>

    </div>
  );
}

export default ChatBox;