import { useState } from "react";
import { FileText } from "lucide-react";

import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const uploadPDF = async () => {
    if (!file) {
      setUploadMessage("Please select a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/pdf/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setUploadMessage(
        data.message || "PDF uploaded successfully."
      );
    } catch {
      setUploadMessage("Upload failed.");
    }

    setUploading(false);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userQuestion,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Unable to connect to backend.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="max-w-7xl mx-auto p-8">

        {/* ================= HEADER ================= */}

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 px-8 py-6 mb-6">

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-5">

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">

                <FileText
                  className="text-white"
                  size={30}
                />

              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  Smart PDF Chat
                </h1>

                <p className="text-slate-500 mt-1">
                  AI Document Assistant powered by
                  FastAPI • Ollama • Qdrant
                </p>

              </div>

            </div>

            <div className="text-right">

              <div className="flex justify-end items-center gap-2">

                <div className="w-3 h-3 rounded-full bg-green-500"></div>

                <p className="font-semibold">
                  Local AI Running
                </p>

              </div>

              <p className="text-sm text-slate-500 mt-2">
                {file
                  ? file.name
                  : "No PDF Selected"}
              </p>

            </div>

          </div>

        </div>

        {/* ================= BODY ================= */}

        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-3">

            <UploadBox
              file={file}
              setFile={setFile}
              uploadPDF={uploadPDF}
              uploading={uploading}
              uploadMessage={uploadMessage}
            />

          </div>

          <div className="col-span-9 bg-white rounded-3xl shadow-lg border border-slate-200 p-6 flex flex-col h-[80vh]">

            <ChatBox
              messages={messages}
              loading={loading}
            />

            <ChatInput
              question={question}
              setQuestion={setQuestion}
              askQuestion={askQuestion}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;