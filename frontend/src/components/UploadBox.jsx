import {
  Upload,
  FileText,
  CheckCircle,
  Database,
  Brain,
  Cpu,
  Loader2,
} from "lucide-react";

import { useTheme } from "../hooks/useTheme.jsx";


function UploadBox({
  file,
  setFile,
  uploadPDF,
  uploading,
  uploadMessage,
}) {


  const { dark } = useTheme();



  const handleFile = (selectedFile) => {

    if (
      selectedFile &&
      selectedFile.type === "application/pdf"
    ) {

      setFile(selectedFile);

    }

  };



  return (

    <div
      className={`
        rounded-3xl
        shadow-lg
        border
        p-6
        h-full
        transition

        ${
          dark
          ?
          "bg-slate-900 border-slate-700 text-white"
          :
          "bg-white border-slate-200 text-slate-900"
        }

      `}
    >





      {/* Header */}


      <div className="flex items-center gap-3 mb-6">


        <div className="
          bg-blue-100
          p-3
          rounded-2xl
        ">

          <Upload
            size={24}
            className="text-blue-600"
          />

        </div>



        <div>


          <h2 className="text-xl font-bold">
            Documents
          </h2>


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
            Upload PDF for AI analysis
          </p>


        </div>


      </div>







      {/* Upload Area */}


      <label

        htmlFor="pdfUpload"

        className={`
          flex
          flex-col
          items-center
          justify-center
          h-48
          rounded-3xl
          border-2
          border-dashed
          cursor-pointer
          transition

          ${
            dark

            ?

            "border-slate-600 hover:bg-slate-800"

            :

            "border-slate-300 hover:bg-slate-50"

          }

        `}

      >


        <Upload
          size={32}
          className="text-blue-600 mb-4"
        />


        <p className="font-semibold">
          Drop your PDF here
        </p>


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
          Click to browse
        </p>



        <input

          id="pdfUpload"

          type="file"

          accept=".pdf"

          className="hidden"

          onChange={(e)=>
            handleFile(
              e.target.files[0]
            )
          }

        />


      </label>







      {/* Selected File */}



      {
        file && (

          <div
            className={`
              mt-5
              p-4
              rounded-2xl
              border

              ${
                dark
                ?
                "bg-slate-800 border-slate-700"
                :
                "bg-slate-50 border-slate-200"
              }

            `}
          >


            <div className="flex gap-3">


              <FileText
                size={28}
                className="text-red-500"
              />


              <div className="min-w-0">


                <p className="font-semibold truncate">
                  {file.name}
                </p>


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

                  {(file.size / 1024 / 1024)
                    .toFixed(2)} MB

                  {" • Ready"}

                </p>


              </div>


            </div>


          </div>

        )
      }








      {/* Upload Button */}



      <button

        onClick={uploadPDF}

        disabled={
          uploading || !file
        }

        className="
          mt-5
          w-full
          flex
          items-center
          justify-center
          gap-2
          bg-blue-600
          hover:bg-blue-700
          disabled:bg-slate-400
          text-white
          py-3
          rounded-2xl
          font-semibold
          transition
        "

      >

        {
          uploading

          ?

          <>
            <Loader2
              size={18}
              className="animate-spin"
            />

            Processing...

          </>

          :

          <>
            <Upload size={18}/>
            Upload PDF
          </>

        }


      </button>








      {/* Upload Message */}



      {
        uploadMessage && (

          <div
            className="
              mt-5
              flex
              items-center
              gap-2
              bg-green-50
              border
              border-green-200
              rounded-xl
              p-3
            "
          >

            <CheckCircle
              size={18}
              className="text-green-600"
            />


            <p className="text-sm text-green-700">
              {uploadMessage}
            </p>


          </div>

        )
      }








      {/* AI Pipeline */}



      <div className="mt-8">


        <h3 className="font-bold mb-4">
          AI Pipeline
        </h3>


        <div className="space-y-4">


          <InfoRow
            icon={<Database size={18}/>}
            title="Vector Database"
            value="Qdrant"
          />


          <InfoRow
            icon={<Brain size={18}/>}
            title="Embedding"
            value="Nomic"
          />


          <InfoRow
            icon={<Cpu size={18}/>}
            title="LLM"
            value="Qwen"
          />


        </div>


      </div>



    </div>

  );

}





function InfoRow({
  icon,
  title,
  value,
}) {


  return (

    <div className="
      flex
      justify-between
      items-center
      text-sm
    ">


      <div className="
        flex
        items-center
        gap-2
      ">

        {icon}

        <span>
          {title}
        </span>


      </div>



      <span className="font-semibold">
        {value}
      </span>


    </div>

  );

}



export default UploadBox;