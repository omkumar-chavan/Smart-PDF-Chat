import {
  Upload,
  FileText,
  CheckCircle,
} from "lucide-react";



function UploadBox({

  file,
  setFile,
  uploadPDF,
  uploading,
  uploadMessage,

}) {



  const handleFile = (e)=>{

    const selected =
      e.target.files[0];


    if(selected){

      setFile(selected);

    }

  };





  return (


    <div

      className="

      h-full

      rounded-3xl

      border

      p-6


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

        mb-6

        "

      >


        <div

          className="

          bg-blue-600

          p-3

          rounded-2xl

          "

        >

          <Upload

            size={22}

            className="text-white"

          />

        </div>



        <div>


          <h2 className="font-bold text-lg">

            Upload PDF

          </h2>


          <p

            className="

            text-sm

            text-slate-500

            dark:text-slate-400

            "

          >

            Upload document for AI analysis

          </p>


        </div>



      </div>








      <label

        className="

        cursor-pointer

        block

        rounded-3xl

        border-2

        border-dashed


        border-slate-300

        dark:border-slate-600


        p-8

        text-center


        hover:bg-slate-50

        dark:hover:bg-slate-800


        transition

        "

      >



        <FileText

          size={40}

          className="

          mx-auto

          mb-4

          text-blue-600

          "

        />



        <p className="font-semibold">

          Choose PDF file

        </p>



        <p

          className="

          text-sm

          mt-2


          text-slate-500

          dark:text-slate-400

          "

        >

          Click here to select

        </p>



        <input

          type="file"

          accept=".pdf"

          hidden

          onChange={handleFile}

        />


      </label>









      {
        file && (

          <div

            className="

            mt-5

            rounded-2xl

            p-4


            bg-slate-50

            dark:bg-slate-800

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

                  Selected File

                </p>



                <p

                  className="

                  text-sm

                  truncate

                  max-w-[200px]


                  text-slate-500

                  dark:text-slate-400

                  "

                >

                  {file.name}

                </p>


              </div>



            </div>



          </div>

        )
      }









      <button

        onClick={uploadPDF}

        disabled={uploading}


        className="

        w-full

        mt-6

        rounded-2xl

        py-3

        font-semibold


        bg-blue-600

        hover:bg-blue-700


        disabled:opacity-50


        text-white


        transition

        "

      >

        {

          uploading

          ?

          "Uploading..."

          :

          "Upload PDF"

        }


      </button>








      {
        uploadMessage && (

          <div

            className="

            mt-5

            rounded-2xl

            p-4


            bg-green-50

            dark:bg-green-950


            border

            border-green-200

            dark:border-green-800

            "

          >


            <div

              className="

              flex

              gap-2

              items-center

              "

            >

              <CheckCircle

                size={18}

                className="text-green-600"

              />


              <p

                className="

                text-sm

                text-green-700

                dark:text-green-300

                "

              >

                {uploadMessage}

              </p>


            </div>


          </div>

        )
      }





    </div>


  );

}



export default UploadBox;