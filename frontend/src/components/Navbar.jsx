import {
  FileText,
  CircleCheck,
  Sun,
  Moon,
} from "lucide-react";

import { useTheme } from "../hooks/useTheme.jsx";


function Navbar() {

  const {
    dark,
    toggleTheme,
  } = useTheme();



  return (
    <nav
      className={`
        rounded-3xl
        shadow-sm
        px-6
        py-4
        flex
        items-center
        justify-between
        border
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



      {/* Brand */}


      <div className="
        flex
        items-center
        gap-3
      ">


        <div className="
          bg-blue-600
          p-3
          rounded-2xl
        ">

          <FileText
            size={24}
            className="text-white"
          />

        </div>



        <div>


          <h1
            className={`
              text-xl
              font-bold
              ${
                dark
                ?
                "text-white"
                :
                "text-slate-800"
              }
            `}
          >
            Smart PDF Chat
          </h1>



          <p
            className={`
              text-sm
              ${
                dark
                ?
                "text-slate-400"
                :
                "text-slate-500"
              }
            `}
          >
            AI Document Assistant
          </p>


        </div>


      </div>






      {/* Right Section */}


      <div className="
        flex
        items-center
        gap-4
      ">


        {/* Theme Button */}


        <button

          onClick={toggleTheme}

          className="
            p-3
            rounded-full
            bg-slate-100
            hover:bg-slate-200
            transition
          "

        >

          {
            dark
            ?
            <Sun size={20}/>
            :
            <Moon size={20}/>
          }


        </button>






        {/* Status */}



        <div className="
          flex
          items-center
          gap-2
          px-4
          py-2
          rounded-full
          bg-green-50
          border
          border-green-200
        ">


          <CircleCheck
            size={18}
            className="text-green-600"
          />


          <span className="
            text-sm
            font-semibold
            text-green-700
          ">
            Local AI Running
          </span>


        </div>


      </div>




    </nav>
  );
}


export default Navbar;