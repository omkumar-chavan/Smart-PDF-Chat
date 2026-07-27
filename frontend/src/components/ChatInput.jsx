import {
  Send,
} from "lucide-react";

import { useTheme } from "../hooks/useTheme.jsx";


function ChatInput({
  question,
  setQuestion,
  askQuestion,
}) {


  const { dark } = useTheme();




  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      askQuestion();

    }

  };





  return (

    <div
      className={`
        border-t
        pt-4
        transition

        ${
          dark
          ?
          "border-slate-700"
          :
          "border-slate-200"
        }

      `}
    >



      <div
        className={`
          flex
          items-center
          gap-3
          rounded-2xl
          p-2
          border
          transition

          ${
            dark
            ?
            "bg-slate-800 border-slate-700"
            :
            "bg-white border-slate-300"
          }

        `}
      >





        <input

          type="text"

          value={question}

          placeholder="Ask anything from your PDF..."

          onChange={(e)=>
            setQuestion(
              e.target.value
            )
          }

          onKeyDown={handleKeyDown}

          className={`
            flex-1
            bg-transparent
            px-4
            py-3
            outline-none
            text-sm

            ${
              dark
              ?
              "text-white placeholder:text-slate-400"
              :
              "text-slate-900 placeholder:text-slate-500"
            }

          `}

        />







        <button

          onClick={askQuestion}

          disabled={!question.trim()}

          className="
            flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-slate-400
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            transition
          "

        >

          <Send
            size={18}
          />

          Send


        </button>






      </div>





    </div>

  );

}


export default ChatInput;