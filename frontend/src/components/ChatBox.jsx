import { useEffect, useRef, useState } from "react";
import {
  Bot,
  User,
  Copy,
  Check,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useTheme } from "../hooks/useTheme.jsx";


function ChatBox({
  messages,
  loading,
}) {

  const bottomRef = useRef(null);

  const [copied, setCopied] = useState(null);

  const { dark } = useTheme();



  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);




  const copyMessage = async (text, index) => {

    await navigator.clipboard.writeText(
      String(text || "")
    );

    setCopied(index);


    setTimeout(() => {
      setCopied(null);
    }, 2000);

  };




  return (

    <div
      className={`
        flex-1
        overflow-y-auto
        rounded-3xl
        p-6

        ${
          dark
          ? "bg-slate-950"
          : "bg-slate-50"
        }

      `}
    >



      {
        messages.length === 0 &&
        !loading && (

          <div
            className="
              h-full
              flex
              flex-col
              justify-center
              items-center
              text-center
            "
          >

            <div
              className="
                bg-blue-100
                p-5
                rounded-full
                mb-5
              "
            >

              <Bot
                size={40}
                className="text-blue-600"
              />

            </div>


            <h2
              className={`
                text-2xl
                font-bold

                ${
                  dark
                  ? "text-white"
                  : "text-slate-900"
                }

              `}
            >
              Smart PDF Chat
            </h2>


            <p
              className={`
                mt-2
                max-w-md

                ${
                  dark
                  ? "text-slate-400"
                  : "text-slate-500"
                }

              `}
            >
              Upload your PDF and ask
              questions about your document.
            </p>


          </div>

        )
      }





      <div className="space-y-6">


        {
          messages.map((msg, index) => (

            <div
              key={index}
              className={`
                flex

                ${
                  msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
                }

              `}
            >


              <div
                className={`
                  flex
                  gap-3
                  max-w-[85%]

                  ${
                    msg.role === "user"
                    ? "flex-row-reverse"
                    : ""
                  }

                `}
              >



                <div
                  className={`
                    w-11
                    h-11
                    rounded-full
                    flex
                    items-center
                    justify-center

                    ${
                      msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-indigo-600"
                    }

                  `}
                >

                  {
                    msg.role === "user"

                    ?

                    <User
                      size={20}
                      className="text-white"
                    />

                    :

                    <Bot
                      size={20}
                      className="text-white"
                    />

                  }

                </div>





                <div
                  className={`
                    rounded-3xl
                    px-5
                    py-4
                    shadow-md

                    ${
                      msg.role === "user"

                      ?

                      "bg-blue-600 text-white"

                      :

                      dark

                      ?

                      "bg-slate-800 text-white"

                      :

                      "bg-white text-slate-900 border"

                    }

                  `}
                >


                  <p
                    className="
                      text-xs
                      font-semibold
                      mb-3
                      opacity-70
                    "
                  >

                    {
                      msg.role === "user"
                      ? "You"
                      : "Smart PDF AI"
                    }

                  </p>




                  {
                    msg.role === "ai"

                    ?

                    <ReactMarkdown
                      remarkPlugins={[
                        remarkGfm
                      ]}
                    >

                      {String(msg.text || "")}

                    </ReactMarkdown>


                    :

                    <p
                      className="
                        whitespace-pre-wrap
                        leading-7
                      "
                    >

                      {msg.text}

                    </p>

                  }






                  {
                    msg.role === "ai" && (

                      <button
                        onClick={() =>
                          copyMessage(
                            msg.text,
                            index
                          )
                        }

                        className="
                          mt-4
                          flex
                          items-center
                          gap-2
                          text-xs
                          opacity-70
                        "
                      >

                        {
                          copied === index

                          ?

                          <>
                            <Check size={14}/>
                            Copied
                          </>

                          :

                          <>
                            <Copy size={14}/>
                            Copy
                          </>

                        }

                      </button>

                    )
                  }



                </div>



              </div>


            </div>

          ))

        }





        {
          loading && (

            <div
              className="
                flex
                gap-3
              "
            >

              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-indigo-600
                  flex
                  items-center
                  justify-center
                "
              >

                <Bot
                  size={20}
                  className="text-white"
                />

              </div>


              <div
                className={`
                  px-5
                  py-4
                  rounded-3xl

                  ${
                    dark
                    ? "bg-slate-800 text-white"
                    : "bg-white"
                  }

                `}
              >

                Thinking...

              </div>


            </div>

          )
        }





        <div ref={bottomRef}/>


      </div>


    </div>

  );

}


export default ChatBox;