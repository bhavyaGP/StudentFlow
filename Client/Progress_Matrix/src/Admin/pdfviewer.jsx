import React, { useRef, useEffect, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/webpack'; // Adjust import path based on your build tool

// Set the worker URL
GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.8.0/build/pdf.worker.min.js';

const PDFViewer = ({ fileUrl }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileUrl) return;

    const loadPdf = async () => {
      try {
        const loadingTask = getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        setLoading(false);
        await page.render(renderContext).promise;
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };

    loadPdf();
  }, [fileUrl]);

  return (
    <div className="relative h-full">
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500">Error: {error}</div>}
      <canvas ref={canvasRef} className="w-full h-full bg-white" />
    </div>
  );
};

export default PDFViewer;
