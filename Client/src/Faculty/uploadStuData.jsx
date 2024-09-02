import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  AiOutlineUpload,
  AiOutlineFileExcel,
  AiOutlineFileText,
  AiOutlineCloseCircle,
} from 'react-icons/ai';

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
    } else {
      showValidationError();
    }
  };

  // Validate file type
  const validateFile = (file) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    return file && validTypes.includes(file.type);
  };

  // Show validation error
  const showValidationError = () => {
    Swal.fire({
      icon: 'error',
      title: 'Invalid File Type',
      text: 'Please upload a valid CSV or Excel file.',
      confirmButtonColor: '#8400EB',
    });
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
    } else {
      showValidationError();
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to upload.',
        confirmButtonColor: '#8400EB',
      });
      return;
    }

    Swal.fire({
      title: 'Uploading...',
      text: 'Please wait while your file is being uploaded.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Swal.fire({
        icon: 'success',
        title: 'Upload Successful',
        text: `${selectedFile.name} has been uploaded successfully.`,
        confirmButtonColor: '#8400EB',
      });

      setSelectedFile(null);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'There was an error uploading your file. Please try again.',
        confirmButtonColor: '#8400EB',
      });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedFile(null);
  };

  return (
    <div className="flex items-center justify-center min-h-[100%] bg-gray-90 p-5 overflow-hidden ">
      <div className="bg-white rounded-lg shadow-lg p-6 m-5 w-full max-w-md max-h-screen overflow-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-nunito">
          Upload Student Data
        </h2>

        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md h-40 mb-4 cursor-pointer transition-colors ${
            isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <AiOutlineUpload className="text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500 font-nunito">
            {isDragging ? 'Drop the file here...' : 'Drag and drop file here or click to select'}
          </p>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded mb-4">
            <div className="flex items-center">
              {selectedFile.type.includes('excel') ? (
                <AiOutlineFileExcel className="text-2xl text-green-500 mr-2" />
              ) : (
                <AiOutlineFileText className="text-2xl text-blue-500 mr-2" />
              )}
              <span className="text-gray-700 font-nunito">{selectedFile.name}</span>
            </div>
            <AiOutlineCloseCircle
              className="text-2xl text-red-500 cursor-pointer"
              onClick={handleCancel}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 font-nunito"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 font-nunito"
          >
            Upload
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          id="fileInput"
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
     </div>
  );
};

export default UploadFile;
