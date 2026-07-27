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

      className="

        rounded-3xl

        px-6

        py-4

        flex

        items-center

        justify-between


        border


        bg-white

        dark:bg-slate-900


        border-slate-200

        dark:border-slate-700


        shadow-sm


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




        <div

          className="

            bg-blue-600

            p-3

            rounded-2xl

          "

        >

          <FileText

            size={24}

            className="text-white"

          />

        </div>






        <div>


          <h1

            className="

              text-xl

              font-bold


              text-slate-900

              dark:text-white

            "

          >

            Smart PDF Chat


          </h1>



          <p

            className="

              text-sm


              text-slate-500

              dark:text-slate-400

            "

          >

            AI Document Assistant


          </p>


        </div>



      </div>








      <div

        className="

          flex

          items-center

          gap-4

        "

      >






        <button


          onClick={toggleTheme}


          className="

            p-3

            rounded-full


            bg-slate-100

            dark:bg-slate-800


            text-slate-700

            dark:text-yellow-400


            hover:bg-slate-200

            dark:hover:bg-slate-700


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









        <div

          className="

            flex

            items-center

            gap-2

            px-4

            py-2

            rounded-full


            bg-green-50

            dark:bg-green-950


            border

            border-green-200

            dark:border-green-800

          "

        >



          <CircleCheck

            size={18}

            className="text-green-600"

          />



          <span

            className="

              text-sm

              font-semibold


              text-green-700

              dark:text-green-300

            "

          >

            Local AI Running


          </span>



        </div>





      </div>



    </nav>


  );

}



export default Navbar;