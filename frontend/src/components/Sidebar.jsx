import {
  FileText,
  Brain,
  Database,
  Cpu,
  Sparkles,
} from "lucide-react";


function Sidebar({
  file,
}) {



  return (


    <div className="space-y-6 h-full">





      {/* Project Card */}


      <div

        className="

        rounded-3xl

        border


        p-5


        bg-white

        dark:bg-slate-900


        border-slate-200

        dark:border-slate-700


        text-slate-900

        dark:text-white


        transition-colors

        duration-300

        "

      >



        <div

          className="

          flex

          items-center

          gap-3

          mb-5

          "

        >



          <div

            className="

            bg-blue-600

            p-3

            rounded-2xl

            "

          >

            <Sparkles

              size={22}

              className="text-white"

            />

          </div>





          <div>


            <h2 className="font-bold text-lg">

              Smart PDF Chat

            </h2>


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

          rounded-2xl

          p-4


          bg-slate-50

          dark:bg-slate-800


          transition

          "

        >



          <div

            className="

            flex

            items-center

            gap-3

            "

          >


            <FileText

              size={22}

              className="text-red-500"

            />



            <div>


              <p className="font-semibold">

                Document

              </p>



              <p

                className="

                text-sm

                truncate

                max-w-[170px]


                text-slate-500

                dark:text-slate-400

                "

              >

                {

                  file

                  ?

                  file.name

                  :

                  "No PDF uploaded"

                }


              </p>



            </div>



          </div>



        </div>



      </div>









      {/* AI Stack */}



      <div

        className="

        rounded-3xl

        border

        p-5


        bg-white

        dark:bg-slate-900


        border-slate-200

        dark:border-slate-700


        text-slate-900

        dark:text-white


        transition-colors

        duration-300

        "

      >



        <h3 className="font-bold mb-5">

          AI Stack

        </h3>





        <div className="space-y-4">



          <StackItem

            icon={<Database size={18}/>}

            title="Vector Database"

            value="Qdrant"

          />



          <StackItem

            icon={<Brain size={18}/>}

            title="Embeddings"

            value="Nomic"

          />



          <StackItem

            icon={<Cpu size={18}/>}

            title="Language Model"

            value="Qwen"

          />



        </div>




      </div>









      {/* System Status */}



      <div

        className="

        rounded-3xl

        p-5

        border


        bg-green-50

        dark:bg-green-950


        border-green-200

        dark:border-green-800

        "

      >



        <p

          className="

          font-semibold


          text-green-700

          dark:text-green-300

          "

        >

          ● System Online

        </p>



        <p

          className="

          text-sm

          mt-2


          text-green-700

          dark:text-green-300

          "

        >

          Local AI services are running.

        </p>



      </div>





    </div>


  );

}






function StackItem({

  icon,

  title,

  value,

}) {


  return (

    <div

      className="

      flex

      items-center

      justify-between

      "

    >



      <div

        className="

        flex

        items-center

        gap-3

        "

      >

        {icon}


        <span className="text-sm">

          {title}

        </span>


      </div>




      <span

        className="

        text-sm

        font-semibold

        "

      >

        {value}

      </span>



    </div>

  );


}





export default Sidebar;