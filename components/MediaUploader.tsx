import React, { useCallback, useMemo } from 'react';
import { useDropzone, Accept } from 'react-dropzone';

interface MediaUploaderProps {
  onMediaSelected: (file: File) => void;
  accept?: string | string[];
  multiple?: boolean;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaSelected, accept = ['image/*', 'video/*', 'audio/*', 'text/plain'], multiple = false }) => {
  const normalizedAccept: Accept = useMemo(() => {
    const acceptArray = Array.isArray(accept) ? accept : accept.split(',').map(s => s.trim());
    const acceptObj: Accept = {};
    acceptArray.forEach(type => {
      acceptObj[type] = [];
    });
    return acceptObj;
  }, [accept]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (multiple) {
        acceptedFiles.forEach(file => onMediaSelected(file));
      } else {
        onMediaSelected(acceptedFiles[0]);
      }
    }
  }, [onMediaSelected, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: normalizedAccept,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-trust-blue bg-trust-blue/10' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-trust-blue font-semibold">Drop the files here ...</p>
      ) : (
        <p className="text-gray-500">
          Drag & drop some files here, or click to select files (images, videos, audio, text)
        </p>
      )}
    </div>
  );
};

export default MediaUploader;
