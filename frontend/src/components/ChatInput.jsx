import {
  Send,
} from "lucide-react";



function ChatInput({

  question,
  setQuestion,
  askQuestion,

}) {



  const handleKeyDown = (e)=>{

    if(
      e.key === "Enter" &&
      !e.shiftKey
    ){

      e.preventDefault();

      askQuestion();

    }

  };





  return (


    <div

      className="

      mt-4

      rounded-3xl

      border


      bg-white

      dark:bg-slate-900


      border-slate-200

      dark:border-slate-700


      p-3


      transition-colors

      duration-300

      "

    >





      <div

        className="

        flex

        items-center

        gap-3

        "

      >





        <textarea

          value={question}

          onChange={(e)=>
            setQuestion(e.target.value)
          }

          onKeyDown={handleKeyDown}


          placeholder="Ask something about your PDF..."


          rows={1}


          className="

          flex-1

          resize-none


          rounded-2xl

          px-4

          py-3


          outline-none


          bg-slate-100

          dark:bg-slate-800


          text-slate-900

          dark:text-white


          placeholder:text-slate-500

          dark:placeholder:text-slate-400


          border

          border-transparent


          focus:border-blue-500


          transition

          "

        />






        <button

          onClick={askQuestion}


          className="

          h-12

          w-12


          rounded-2xl


          flex

          items-center

          justify-center



          bg-blue-600

          hover:bg-blue-700


          text-white


          transition

          "

        >

          <Send size={20}/>


        </button>






      </div>





      <p

        className="

        text-xs

        mt-2

        ml-2


        text-slate-500

        dark:text-slate-400

        "

      >

        Press Enter to send

      </p>




    </div>


  );

}



export default ChatInput;