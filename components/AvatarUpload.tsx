'use client';

import { useCallback, useState } from 'react';
import { Camera, X, AlertCircle, User } from 'lucide-react';
import { validateImageFile } from '@/lib/validations/applicationSchema';
import Image from 'next/image';

interface AvatarUploadProps {
  file: File | null;
  previewUrl: string | null;
  onFileSelect: (file: File | null, previewUrl: string | null) => void;
  error: string | null;
}

export function AvatarUpload({ file, previewUrl, onFileSelect, error }: AvatarUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (selectedFile: File | null) => {
      if (!selectedFile) return;
      const err = validateImageFile(selectedFile);
      if (err) {
        onFileSelect(null, null);
        return;
      }
      const url = URL.createObjectURL(selectedFile);
      onFileSelect(selectedFile, url);
    },
    [onFileSelect]
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <label
        className={`relative w-28 h-28 cursor-pointer group border-2 border-dashed transition-all ${
          dragOver
            ? 'border-[#8B0000] bg-red-50'
            : error
            ? 'border-red-400 bg-red-50'
            : 'border-[#D4D4D8] hover:border-[#8B0000] bg-[#F4F4F5]'
        }`}
        style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.8)' }}
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
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />

        {previewUrl ? (
          <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <User className={`w-8 h-8 ${error ? 'text-red-400' : 'text-[#A1A1AA]'}`} />
            <Camera className={`w-4 h-4 ${error ? 'text-red-500' : 'text-[#8B0000]'}`} />
          </div>
        )}

        {previewUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        )}
      </label>

      <div className="text-center">
        <p className="text-xs font-semibold text-[#3F3F46] uppercase tracking-wide">Profile Photo</p>
        <p className="text-xs text-[#71717A] mt-0.5">JPG / PNG · Max 2 MB</p>
      </div>

      {file && (
        <button
          type="button"
          onClick={() => onFileSelect(null, null)}
          className="flex items-center gap-1 text-xs text-[#8B0000] hover:underline font-medium"
        >
          <X className="w-3.5 h-3.5" /> Remove
        </button>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
