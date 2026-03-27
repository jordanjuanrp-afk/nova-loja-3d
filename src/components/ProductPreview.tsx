import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Move3D } from 'lucide-react';

interface ProductPreviewProps {
  modelUrl?: string;
  imageUrl: string;
  productName: string;
}

export default function ProductPreview({ modelUrl, imageUrl, productName }: ProductPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastX = clientX;
      lastY = clientY;
      setIsInteracting(true);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - lastX;
      const deltaY = clientY - lastY;
      
      setRotation(prev => ({
        x: prev.x + deltaY * 0.5,
        y: prev.y + deltaX * 0.5
      }));
      
      lastX = clientX;
      lastY = clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', handleMouseUp);
      container.addEventListener('touchstart', handleMouseDown, { passive: true });
      container.addEventListener('touchmove', handleMouseMove, { passive: true });
      container.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', handleMouseUp);
        container.removeEventListener('touchstart', handleMouseDown);
        container.removeEventListener('touchmove', handleMouseMove);
        container.removeEventListener('touchend', handleMouseUp);
      }
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(3, Math.max(0.5, prev - e.deltaY * 0.001)));
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={`relative aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing ${isInteracting ? 'ring-2 ring-blue-500' : ''}`}
        onWheel={handleWheel}
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isInteracting ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            draggable={false}
          />
        </div>

        {/* 3D Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-black/20" />
        
        {/* Loading indicator */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-2">
          <Move3D size={14} className="text-blue-400" />
          <span className="text-xs text-white/80 font-medium">3D Preview</span>
        </div>

        {/* Instructions */}
        {!isInteracting && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-xs text-white/60">
              Arraste para rotacionar • Scroll para zoom
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          title="Ampliar"
        >
          <ZoomIn size={20} className="text-white" />
        </button>
        
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          title="Reduzir"
        >
          <ZoomOut size={20} className="text-white" />
        </button>
        
        <button
          onClick={resetView}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          title="Resetar vista"
        >
          <RotateCw size={20} className="text-white" />
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          title="Tela cheia"
        >
          <Maximize2 size={20} className="text-white" />
        </button>
      </div>

      {/* Zoom level indicator */}
      <div className="text-center">
        <span className="text-xs text-gray-500">
          Zoom: {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
}
