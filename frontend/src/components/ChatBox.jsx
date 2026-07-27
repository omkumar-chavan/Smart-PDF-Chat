import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  User,
  Copy,
  Check,
} from "lucide-react";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";


function ChatBox({
  messages,
  loading,
}) {


  const bottomRef = useRef(null);

  const [copied, setCopied] = useState(null);



  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);





  const copyText = async(text,index)=>{

    if(!text) return;


    await navigator.clipboard.writeText(text);


    setCopied(index);


    setTimeout(()=>{

      setCopied(null);

    },2000);

  };




  return (

    <div
      className="
        flex-1
        overflow-y-auto
        rounded-3xl
        p-6
        bg-slate-50
        dark:bg-slate-950
        transition-colors
        duration-300
      "
    >


      {
        messages.length === 0 && !loading && (

          <div
            className="
              h-full
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div
              className="
                bg-blue-100
                dark:bg-blue-950
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
              className="
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Smart PDF AI
            </h2>


            <p
              className="
                mt-2
                text-slate-500
                dark:text-slate-400
              "
            >
              Upload PDF and ask questions.
            </p>


          </div>

        )
      }





      <div className="space-y-6">


        {
          messages.map((msg,index)=>{


            const text = msg.text || "No response received.";


            return (

              <div
                key={index}
                className={`
                  flex
                  ${msg.role==="user"
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
                      msg.role==="user"
                      ? "flex-row-reverse"
                      : ""
                    }
                  `}
                >



                  <div
                    className={`
                      h-11
                      w-11
                      rounded-full
                      flex
                      items-center
                      justify-center
                      shrink-0

                      ${
                        msg.role==="user"
                        ? "bg-blue-600"
                        : "bg-slate-800"
                      }
                    `}
                  >

                    {
                      msg.role==="user"

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
                      rounded-2xl
                      px-5
                      py-4
                      shadow

                      ${
                        msg.role==="user"

                        ?

                        "bg-blue-600 text-white"

                        :

                        "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"

                      }
                    `}
                  >



                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        mb-2
                      "
                    >


                      <span
                        className="font-semibold text-sm"
                      >

                        {
                          msg.role==="user"
                          ?
                          "You"
                          :
                          "Smart PDF AI"
                        }

                      </span>




                      {
                        msg.role==="ai" && (

                          <button
                            onClick={()=>
                              copyText(
                                text,
                                index
                              )
                            }

                            className="
                              ml-4
                              text-slate-500
                              dark:text-slate-300
                            "
                          >

                            {
                              copied===index
                              ?
                              <Check size={16}/>
                              :
                              <Copy size={16}/>
                            }

                          </button>

                        )
                      }



                    </div>






                    {
                      msg.role==="ai"

                      ?

                      <div
                        className="
                          prose
                          dark:prose-invert
                          max-w-none
                        "
                      >

                        <Markdown
                          remarkPlugins={[
                            remarkGfm
                          ]}
                        >
                          {String(text)}
                        </Markdown>


                      </div>


                      :


                      <p className="whitespace-pre-wrap">
                        {text}
                      </p>


                    }



                  </div>




                </div>



              </div>

            );

          })
        }






        {
          loading && (

            <div className="flex gap-3">


              <div
                className="
                  h-11
                  w-11
                  rounded-full
                  bg-slate-800
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
                className="
                  rounded-2xl
                  px-5
                  py-4
                  bg-white
                  dark:bg-slate-800
                  border
                  border-slate-200
                  dark:border-slate-700
                  text-slate-900
                  dark:text-white
                "
              >

                Smart PDF AI typing...

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