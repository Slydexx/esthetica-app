
import React, { useState, useRef } from 'react';
import { UploadCloudIcon, XIcon } from './icons';
import { t } from '../i18n';

interface ImageUploaderProps {
  onImagesUpload: (images: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload }) => {
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeIndexRef = useRef<number | null>(null);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85); 
          resolve(dataUrl);
        } else {
          reject(new Error("Canvas context not available"));
        }
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files) as File[];
    const newPreviews = [...previews];

    try {
        const resizedImages = await Promise.all(filesArray.map(file => resizeImage(file)));
        const clickedIndex = activeIndexRef.current;

        if (clickedIndex !== null) {
            newPreviews[clickedIndex] = resizedImages[0];
        } else {
            let imageCursor = 0;
            for (let i = 0; i < newPreviews.length && imageCursor < resizedImages.length; i++) {
                if (newPreviews[i] === null) {
                    newPreviews[i] = resizedImages[imageCursor];
                    imageCursor++;
                }
            }
        }

        setPreviews(newPreviews);
        const validImages = newPreviews.filter(p => p !== null) as string[];
        onImagesUpload(validImages);
    } catch (error) {
        console.error("Error processing images:", error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = (index?: number) => {
    const isSingleUpload = typeof index === 'number';
    activeIndexRef.current = isSingleUpload ? index : null;
    
    if (fileInputRef.current) {
        fileInputRef.current.multiple = !isSingleUpload;
        fileInputRef.current.accept = "image/jpeg, image/png, image/webp";
        fileInputRef.current.click();
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);
    const validImages = newPreviews.filter(p => p !== null) as string[];
    onImagesUpload(validImages);
  };

  const labels = [t('imageUploader.frontView'), t('imageUploader.rightProfile'), t('imageUploader.leftProfile')];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {previews.map((preview, index) => (
          <div key={index} className="aspect-w-3 aspect-h-4">
            {preview ? (
              <div className="relative group rounded-2xl overflow-hidden border border-stone-200 shadow-md h-64 md:h-auto">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/40 transition-all duration-300 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-3 bg-white rounded-full text-stone-900 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 hover:bg-red-50 hover:text-red-600"
                    aria-label={t('imageUploader.removeImageAria', { index: index + 1 })}
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur text-stone-800 text-center py-3 text-[10px] font-bold uppercase tracking-widest border-t border-stone-100">{labels[index]}</div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => triggerFileInput(index)}
                className="w-full h-64 md:h-auto border border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center text-stone-400 hover:border-gold-400 hover:text-gold-600 hover:bg-stone-50 transition-all duration-300 p-6 bg-stone-50/50"
                aria-label={t('imageUploader.uploadAria', { label: labels[index] })}
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 text-stone-400 shadow-sm border border-stone-100 group-hover:text-gold-500 group-hover:border-gold-200 transition-colors">
                     <UploadCloudIcon className="w-6 h-6" />
                </div>
                <span className="text-center text-[10px] font-bold uppercase tracking-widest">{labels[index]}</span>
              </button>
            )}
          </div>
        ))}
      </div>
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
    </div>
  );
};
