import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import UploadBox from "./components/UploadBox";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";



function App() {


  const [question,setQuestion] = useState("");

  const [messages,setMessages] = useState([]);

  const [loading,setLoading] = useState(false);

  const [file,setFile] = useState(null);

  const [uploading,setUploading] = useState(false);

  const [uploadMessage,setUploadMessage] = useState("");






  const uploadPDF = async()=>{


    if(!file){

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



    try{


      const response = await fetch(

        "http://127.0.0.1:8000/pdf/upload",

        {

          method:"POST",

          body:formData,

        }

      );



      const data =
      await response.json();




      if(!response.ok){

        throw new Error(

          data.detail ||
          "Upload failed"

        );

      }




      setUploadMessage(

        data.message ||
        "PDF uploaded successfully."

      );



    }

    catch(error){


      setUploadMessage(

        error.message ||
        "Upload failed."

      );


    }




    setUploading(false);


  };









  const askQuestion = async()=>{


    if(!question.trim())
      return;




    const userQuestion = question;




    setMessages(prev=>[

      ...prev,

      {

        role:"user",

        text:userQuestion,

      }

    ]);




    setQuestion("");

    setLoading(true);





    try{


      const response = await fetch(

        "http://127.0.0.1:8000/chat/",

        {

          method:"POST",

          headers:{

            "Content-Type":
            "application/json",

          },


          body:JSON.stringify({

            question:userQuestion,

          }),

        }

      );





      const data =
      await response.json();




      if(!response.ok){

        throw new Error(

          data.detail ||
          "Chat failed"

        );

      }







      setMessages(prev=>[

        ...prev,


        {

          role:"ai",

          text:

          data.answer ||

          "No answer generated.",


          sources:

          data.sources || [],

        }

      ]);



    }



    catch(error){


      setMessages(prev=>[

        ...prev,


        {

          role:"ai",

          text:

          error.message ||

          "Unable to generate AI response.",


          sources:[],

        }

      ]);



    }



    setLoading(false);


  };












  return (

    <div

      className="

        min-h-screen

        p-6


        bg-slate-100

        dark:bg-slate-950


        text-slate-900

        dark:text-white


        transition-all

        duration-300

      "

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







        <div

          className="

            col-span-3

            h-[85vh]

          "

        >

          <Sidebar

            file={file}

          />


        </div>









        <div

          className="

            col-span-9

            grid

            grid-cols-12

            gap-6

          "

        >






          <div

            className="

              col-span-4

              h-[85vh]

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









          <div

            className="

              col-span-8

              h-[85vh]


              flex

              flex-col


              rounded-3xl


              p-6


              bg-white

              dark:bg-slate-900


              border

              border-slate-200

              dark:border-slate-700


              shadow-lg


              transition-all

              duration-300

            "

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