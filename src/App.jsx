import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx"


function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emaillist, setemaillist] = useState([])

  function handlemsg(e) {
    setmsg(e.target.value)
  }

  function handlefile(e) {
    const file = e.target.files[0]

    const reader = new FileReader()

    reader.onload = function (e) {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetname = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetname]
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemails = emaillist.map(function(item){return item.A})
      setemaillist(totalemails)
      console.log(totalemails)
    }

    reader.readAsBinaryString(file)
  }

 function send() {
  setstatus(true);

  axios
    .post("https://bulk-maild-backend.onrender.com/", { msg, emaillist })
    .then((res) => {
      if (res.data.success === true) {
        alert("Email Sent Successfully");
      } else {
        alert("Error in sending email");
      }
      setstatus(false);
    })
    .catch((err) => {
      console.log(err);
      alert("Server Error");
      setstatus(false);
    });
}

  return (
    <div>
      <div className="bg-red-500 text-white text-center">
        <h1 className="text-3xl font-medium px-5 p-4">BulkMail</h1>
      </div>

      <div className="bg-orange-300 text-white text-center">
        <h1 className="text-xl font-medium px-5 p-4">
          We are BulkMail, Help your business grow with our email marketing platform
        </h1>
      </div>

      <div className="bg-green-600 text-white text-center">
        <h1 className="text-xl font-medium px-5 p-4">Drag and Drop</h1>
      </div>

      <div className="bg-gray-100 flex flex-col items-center text-black px-5 py-3 pb-22">
        <textarea
          className="w-full h-64 p-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email text..."
          value={msg}
          onChange={handlemsg}
        ></textarea>

        <div>
          <input
            type="file"
            onChange={handlefile}
            className="w-full max-w-md border-2 border-dashed border-gray-500 rounded-xl p-3 bg-white
              file:mr-4 file:py-1 file:px-2
              file:rounded-lg file:border-0
              file:bg-gray-500 file:text-white
              file:font-semibold
              hover:file:bg-gray-300
              cursor-pointer"
          />
        </div>
        <p className="mt-4 ">Total E-mails in the file: {emaillist.length}</p>
        <button onClick={send} className="bg-gray-500 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded mt-4 mb-3">
          {status ? "Email Sent Successfully" : "Send Email"}
        </button>
      </div>
    </div>
  );
}

export default App;
