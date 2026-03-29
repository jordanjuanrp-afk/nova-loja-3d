
import React, { useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  productName?: string;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  productName
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight' && onNext) onNext();
    if (e.key === 'ArrowLeft' && onPrev) onPrev();
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-4 bg-white/10 hover:bg-white/30 border border-white/20 rounded-full transition-all cursor-pointer backdrop-blur-md group"
        >
          <X size={28} className="text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="absolute top-4 left-4 z-10">
          <span className="text-white/60 text-sm font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            {productName && `${productName} - `}{currentIndex + 1} / {images.length}
          </span>
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage}
            alt={productName || 'Product image'}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl shadow-black/50"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/30 border border-white/20 rounded-full transition-all backdrop-blur-md"
            >
              <ChevronLeft size={32} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext?.(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/30 border border-white/20 rounded-full transition-all backdrop-blur-md"
            >
              <ChevronRight size={32} className="text-white" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
                      ? 'bg-white w-8'
                      : 'bg-white/40 hover:bg-white/70'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ImageLightbox;
