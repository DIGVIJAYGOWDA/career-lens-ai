'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface ResumeUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUpload, isLoading = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const isExtensionValid = /\.(pdf|docx|doc)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setError('Only PDF and DOCX files are allowed.');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setUploadProgress(30);
    try {
      setUploadProgress(70);
      await onUpload(selectedFile);
      setUploadProgress(100);
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume');
      setUploadProgress(0);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-base font-semibold text-white mb-1">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-slate-400 mb-4">
            Supports PDF and DOCX files up to 10MB
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            <FileText className="w-3.5 h-3.5" /> Select Resume File
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white truncate max-w-xs">{selectedFile.name}</h4>
                <p className="text-xs text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.name.split('.').pop()?.toUpperCase()}
                </p>
              </div>
            </div>
            {!isLoading && (
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {uploadProgress > 0 && (
            <div className="mb-4">
              <ProgressBar value={uploadProgress} colorScheme="indigo" size="sm" />
              <p className="text-xs text-slate-400 mt-1">
                {uploadProgress === 100 ? 'Processing file...' : 'Uploading file...'}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFile(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Upload
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
