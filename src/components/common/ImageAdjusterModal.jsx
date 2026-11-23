import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Move,
  Check,
  X,
  RotateCcw as ResetIcon,
  Sliders,
  Crop
} from 'lucide-react';

export const ImageAdjusterModal = ({
  isOpen,
  onClose,
  imageSrc,
  onSave,
  aspectType = 'circle', // 'circle' | 'square'
  title = 'Adjust & Crop Image'
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Viewport & Crop box size
  const CROP_SIZE = 260; // 260px square / circle viewport

  // Reset state when a new image is loaded or modal opens
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setImageLoaded(false);

      const img = new Image();
      img.onload = () => {
        setImageNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImageLoaded(true);
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc]);

  // Handle Drag / Pan with mouse
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setPan({
      x: dragStart.panX + deltaX,
      y: dragStart.panY + deltaY
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle Touch drag
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y
      });
    }
  };

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    setPan({
      x: dragStart.panX + deltaX,
      y: dragStart.panY + deltaY
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    setZoom((prevZoom) => Math.min(Math.max(0.5, prevZoom + zoomDelta), 3.5));
  };

  // Add global mouseup/touchend listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Rotate 90 degrees
  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Generate cropped output canvas
  const handleApplyCrop = () => {
    if (!imageSrc) return;

    const img = new Image();
    // Only set crossOrigin for external http/https URLs to prevent tainting data/blob URLs
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const OUTPUT_SIZE = 600; // Output 600x600 high res
        const canvas = document.createElement('canvas');
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext('2d');

        // Clear background
        ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

        // If circle crop, clip to circle
        if (aspectType === 'circle') {
          ctx.beginPath();
          ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
        }

        ctx.save();
        // Calculate ratio between preview crop size and export canvas size
        const scaleFactor = OUTPUT_SIZE / CROP_SIZE;

        // 1. Move canvas origin to the exact target center:
        // Center of canvas (OUTPUT_SIZE / 2) + panned offset scaled to export resolution
        ctx.translate(
          OUTPUT_SIZE / 2 + pan.x * scaleFactor,
          OUTPUT_SIZE / 2 + pan.y * scaleFactor
        );

        // 2. Rotate around the image center
        ctx.rotate((rotation * Math.PI) / 180);

        // 3. Scale/zoom around the image center
        ctx.scale(zoom, zoom);

        // 4. Calculate how the image is fitted in preview
        const imgAspect = img.naturalWidth / img.naturalHeight;
        let drawWidth, drawHeight;

        if (imgAspect >= 1) {
          drawHeight = OUTPUT_SIZE;
          drawWidth = OUTPUT_SIZE * imgAspect;
        } else {
          drawWidth = OUTPUT_SIZE;
          drawHeight = OUTPUT_SIZE / imgAspect;
        }

        // 5. Draw image centered at (0, 0)
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        const croppedDataUrl = canvas.toDataURL('image/png', 0.95);
        onSave(croppedDataUrl);
        onClose();
      } catch (err) {
        console.error('Canvas export error:', err);
        // Fallback: save original if canvas export fails
        onSave(imageSrc);
        onClose();
      }
    };

    img.onerror = (err) => {
      console.error('Image load error for cropping:', err);
      onSave(imageSrc);
      onClose();
    };

    img.src = imageSrc;
  };

  if (!isOpen || !imageSrc) return null;

  // Calculate preview fit dimensions
  const imgAspect = imageNaturalSize.width && imageNaturalSize.height
    ? imageNaturalSize.width / imageNaturalSize.height
    : 1;

  let previewWidth, previewHeight;
  if (imgAspect >= 1) {
    previewHeight = CROP_SIZE;
    previewWidth = CROP_SIZE * imgAspect;
  } else {
    previewWidth = CROP_SIZE;
    previewHeight = CROP_SIZE / imgAspect;
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div
          className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-md border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <Crop className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  {title}
                </h3>
                <p className="text-[10px] text-slate-500">
                  Drag to move, zoom & rotate to fit perfectly
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Crop Viewport Area */}
          <div className="p-5 flex flex-col items-center bg-slate-900">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onWheel={handleWheel}
              style={{ width: `${CROP_SIZE}px`, height: `${CROP_SIZE}px` }}
              className={`relative overflow-hidden bg-slate-950 select-none shadow-inner border-2 border-slate-700 ${
                aspectType === 'circle' ? 'rounded-full' : 'rounded-2xl'
              } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              title="Click and drag to reposition image. Scroll to zoom."
            >
              {/* Image with transforms */}
              {imageLoaded && (
                <div
                  className="absolute pointer-events-none transition-transform duration-75 ease-out"
                  style={{
                    left: `${CROP_SIZE / 2}px`,
                    top: `${CROP_SIZE / 2}px`,
                    transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: 'center center'
                  }}
                >
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Adjust preview"
                    draggable={false}
                    style={{
                      width: `${previewWidth}px`,
                      height: `${previewHeight}px`,
                      maxWidth: 'none',
                      maxHeight: 'none'
                    }}
                    className="object-cover"
                  />
                </div>
              )}

              {/* Viewport Crosshair Guidelines */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-white/10" />
                <div className="border-r border-white/10" />
                <div className="" />
              </div>

              {/* Move hint badge */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-full pointer-events-none backdrop-blur-xs flex items-center gap-1">
                <Move className="w-2.5 h-2.5" /> Drag to adjust
              </div>
            </div>
          </div>

          {/* Adjustment Controls Panel */}
          <div className="p-4 bg-white space-y-4 text-xs">
            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-700 font-bold">
                <span className="flex items-center gap-1 text-[11px]">
                  <ZoomIn className="w-3.5 h-3.5 text-teal-600" /> Zoom Level
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3.0, z + 0.15))}
                  className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Tools: Rotate & Reset */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRotateLeft}
                  className="px-2.5 py-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1 cursor-pointer"
                  title="Rotate Left 90°"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rotate -90°</span>
                </button>
                <button
                  type="button"
                  onClick={handleRotateRight}
                  className="px-2.5 py-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1 cursor-pointer"
                  title="Rotate Right 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate +90°</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition flex items-center gap-1 cursor-pointer"
                title="Reset adjustments to default"
              >
                <ResetIcon className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="border-t border-slate-100 px-5 py-3.5 bg-slate-50 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              className="px-5 py-2 text-xs font-black text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
