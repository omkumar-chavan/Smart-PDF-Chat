import {
  Upload,
  FileText,
  CheckCircle,
  Database,
  Brain,
  Cpu,
} from "lucide-react";

function UploadBox({
  file,
  setFile,
  uploadPDF,
  uploading,
  uploadMessage,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 h-full">

      {/* Title */}

      <div className="flex items-center gap-3 mb-6">

        <div className="bg-blue-100 p-3 rounded-xl">
          <Upload
            className="text-blue-600"
            size={22}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            Documents
          </h2>

          <p className="text-sm text-slate-500">
            Upload your PDF
          </p>
        </div>

      </div>

      {/* Upload Area */}

      <label
        htmlFor="pdfFile"
        className="
          flex
          flex-col
          items-center
          justify-center
          border-2
          border-dashed
          border-slate-300
          rounded-2xl
          h-44
          cursor-pointer
          hover:bg-slate-50
          hover:border-blue-500
          transition
        "
      >

        <Upload
          size={42}
          className="text-blue-600 mb-3"
        />

        <p className="font-semibold">
          Click to Upload
        </p>

        <p className="text-sm text-slate-500">
          PDF only
        </p>

        <input
          id="pdfFile"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

      </label>

      {/* Selected File */}

      {file && (

        <div className="mt-6 rounded-2xl bg-slate-50 border p-4">

          <div className="flex gap-3">

            <FileText
              className="text-red-500"
              size={26}
            />

            <div>

              <p className="font-semibold break-all">
                {file.name}
              </p>

              <p className="text-sm text-slate-500">
                Ready for indexing
              </p>

            </div>

          </div>

        </div>

      )}

      {/* Upload Button */}

      <button
        onClick={uploadPDF}
        disabled={uploading}
        className="
          w-full
          mt-5
          bg-blue-600
          hover:bg-blue-700
          disabled:bg-blue-300
          text-white
          rounded-2xl
          py-3
          font-semibold
          transition
        "
      >
        {uploading
          ? "Uploading..."
          : "Upload PDF"}
      </button>

      {/* Success */}

      {uploadMessage && (

        <div className="mt-5 flex gap-2 items-center bg-green-50 border border-green-200 rounded-xl p-3">

          <CheckCircle
            size={18}
            className="text-green-600"
          />

          <p className="text-sm text-green-700">
            {uploadMessage}
          </p>

        </div>

      )}

      {/* Statistics */}

      <div className="mt-8">

        <h3 className="font-bold mb-4">
          AI Information
        </h3>

        <div className="space-y-3">

          <div className="flex justify-between items-center">

            <div className="flex gap-2 items-center">

              <Database size={18} />

              <span>Vector DB</span>

            </div>

            <span className="font-semibold">
              Qdrant
            </span>

          </div>

          <div className="flex justify-between items-center">

            <div className="flex gap-2 items-center">

              <Brain size={18} />

              <span>Embedding</span>

            </div>

            <span className="font-semibold">
              Nomic
            </span>

          </div>

          <div className="flex justify-between items-center">

            <div className="flex gap-2 items-center">

              <Cpu size={18} />

              <span>LLM</span>

            </div>

            <span className="font-semibold">
              Qwen 3.5
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UploadBox;