
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Eraser, RotateCcw, Save } from 'lucide-react';

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#8A7CFF'); // Default color (lavender)
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Available colors
  const colors = [
    '#8A7CFF', // lavender
    '#FFB7A1', // peach
    '#A1D2FF', // blue
    '#FFF3E0', // cream
    '#F9C4FF', // pink
    '#C4F9FF', // light blue
    '#FFFFC4', // light yellow
    '#FFFFFF', // white
  ];

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas size to match its display size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Set initial canvas background to white
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        setCtx(context);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    setIsDrawing(true);
    
    const { offsetX, offsetY } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!ctx) return;
    
    setIsDrawing(false);
    ctx.closePath();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) {
      return { offsetX: 0, offsetY: 0 };
    }
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const saveDrawing = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'solace-drawing.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="solace-card mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Express Yourself</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleEraser}
            className={isEraser ? "bg-solace-lavender text-white" : ""}
          >
            <Eraser size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={clearCanvas}>
            <RotateCcw size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={saveDrawing}>
            <Save size={18} />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        {colors.map((c) => (
          <button
            key={c}
            className={`w-6 h-6 rounded-full transition-all ${
              color === c && !isEraser ? 'ring-2 ring-offset-2 ring-solace-lavender' : ''
            }`}
            style={{ backgroundColor: c }}
            onClick={() => {
              setColor(c);
              setIsEraser(false);
            }}
          />
        ))}
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="brush-size" className="text-sm">Size:</label>
          <input
            id="brush-size"
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
      
      <div className="relative border border-solace-lavender/20 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full h-[300px] touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <p className="text-sm text-center mt-2 text-foreground/60">Draw freely to express your feelings</p>
    </div>
  );
};

export default DrawingCanvas;
