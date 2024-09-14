import React, { useState } from 'react';
import PDFViewer from './pdfviewer';

const App = () => {
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(URL.createObjectURL(selectedFile));
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
  };

  return (
    <div className="container mx-auto p-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4 border border-gray-300 rounded p-2"
      />
      {file && (
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          View File
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg relative max-w-4xl w-full h-3/4">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-500 text-2xl hover:text-red-700"
            >
              &times;
            </button>
            <div className="h-full">
              {file && <PDFViewer fileUrl={file} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
