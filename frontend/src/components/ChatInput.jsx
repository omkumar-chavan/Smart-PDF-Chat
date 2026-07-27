function ChatInput({
  question,
  setQuestion,
  askQuestion,
}) {
  return (
    <div className="border-t pt-4">

      <div className="flex items-center gap-3">

        <input
          type="text"
          value={question}
          placeholder="Ask anything from your PDF..."
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askQuestion();
            }
          }}
          className="
            flex-1
            rounded-xl
            border
            border-gray-300
            px-5
            py-3
            outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            transition
          "
        />

        <button
          onClick={askQuestion}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            px-6
            py-3
            rounded-xl
            transition
          "
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default ChatInput;