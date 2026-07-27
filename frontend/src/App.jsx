import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";

import { useTheme } from "./hooks/useTheme.jsx";


function App() {

  const { dark } = useTheme();


  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);


  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [uploadMessage, setUploadMessage] = useState("");




  const uploadPDF = async () => {


    if (!file) {

      setUploadMessage(
        "Please select a PDF first."
      );

      return;

    }



    const formData = new FormData();

    formData.append(
      "file",
      file
    );



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
        data.message ||
        "PDF uploaded successfully."
      );


    } catch {


      setUploadMessage(
        "Upload failed."
      );


    }


    setUploading(false);

  };







  const askQuestion = async () => {


    if (!question.trim())
      return;



    const userQuestion = question;



    setMessages((prev) => [

      ...prev,

      {
        role: "user",
        text: userQuestion,
      }

    ]);



    setQuestion("");

    setLoading(true);




    try {


      const response = await fetch(
        "http://127.0.0.1:8000/chat/",
        {
          method: "POST",

          headers: {
            "Content-Type":
            "application/json",
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
        }

      ]);



    } catch {


      setMessages((prev) => [

        ...prev,

        {
          role: "ai",
          text:
          "Unable to connect to backend.",
        }

      ]);

    }



    setLoading(false);

  };








  return (

    <div
      className={`
        min-h-screen
        p-6
        transition-all
        duration-300

        ${
          dark
          ?
          "bg-slate-950"
          :
          "bg-slate-100"
        }

      `}
    >


      <Navbar />





      <div
        className="
          grid
          grid-cols-12
          gap-6
          mt-6
        "
      >




        {/* Sidebar */}


        <div
          className="
            col-span-12
            lg:col-span-3
            h-auto
            lg:h-[85vh]
          "
        >

          <Sidebar
            file={file}
          />

        </div>







        {/* Main Area */}


        <div
          className="
            col-span-12
            lg:col-span-9
            grid
            grid-cols-12
            gap-6
          "
        >






          {/* Upload Box */}


          <div
            className="
              col-span-12
              xl:col-span-4
              h-auto
              xl:h-[85vh]
            "
          >

            <UploadBox

              file={file}

              setFile={setFile}

              uploadPDF={uploadPDF}

              uploading={uploading}

              uploadMessage={uploadMessage}

            />

          </div>









          {/* Chat Workspace */}


          <div

            className={`
              col-span-12
              xl:col-span-8

              rounded-3xl
              shadow-lg
              border
              p-6
              flex
              flex-col
              h-[85vh]

              transition

              ${
                dark

                ?

                "bg-slate-900 border-slate-700"

                :

                "bg-white border-slate-200"

              }

            `}

          >



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