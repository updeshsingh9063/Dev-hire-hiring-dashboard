'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { validateResumeFile } from '@/lib/validations/applicationSchema';

interface ResumeUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error: string | null;
}

export function ResumeUpload({ file, onFileSelect, error }: ResumeUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (selectedFile: File | null) => {
      if (!selectedFile) return;
      const err = validateResumeFile(selectedFile);
      if (err) { onFileSelect(null); return; }
      onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  if (file) {
    return (
      <div
        className="flex items-center gap-3 p-3 border-2 border-[#8B0000] bg-[#FFF0F0]"
        style={{ boxShadow: '3px 3px 0 0 rgba(139,0,0,0.4)' }}
      >
        <FileText className="w-5 h-5 text-[#8B0000] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#111111] text-sm truncate">{file.name}</p>
          <p className="text-xs text-[#71717A]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <button
          type="button"
          onClick={() => onFileSelect(null)}
          className="btn-icon btn-icon-danger"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed cursor-pointer transition-all ${
          dragOver
            ? 'border-[#8B0000] bg-[#FFF0F0]'
            : error
            ? 'border-red-400 bg-red-50'
            : 'border-[#D4D4D8] hover:border-[#8B0000] hover:bg-[#FFF8F8]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />
        <div
          className="w-12 h-12 flex items-center justify-center bg-white border-2 border-[#D4D4D8] mb-3"
          style={{ boxShadow: '3px 3px 0 0 rgba(0,0,0,0.7)' }}
        >
          <Upload className={`w-5 h-5 ${error ? 'text-red-500' : 'text-[#8B0000]'}`} />
        </div>
        <p className="font-bold text-[#111111] text-sm">Click to upload or drag and drop</p>
        <p className="text-xs text-[#71717A] mt-1 uppercase tracking-wide font-medium">PDF ONLY · Maximum 5 MB</p>
      </label>

      {error && (
        <p className="flex items-center gap-1.5 mt-2 text-xs text-red-500 font-medium">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
