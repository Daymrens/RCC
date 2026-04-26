'use client';

import { useRef, useEffect, useState } from 'react';

interface JoystickWidgetProps {
  config: { size?: number; sensitivity?: number };
  onSend: (command: string) => void;
}

export default function JoystickWidget({ config, onSend }: JoystickWidgetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const size = config.size || 150;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size / 2 - 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#2A2A30';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw joystick
    ctx.beginPath();
    ctx.arc(centerX + position.x, centerY + position.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
  }, [position, size, centerX, centerY, maxRadius]);

  const handleMove = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;

    const distance = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);

    const limitedDistance = Math.min(distance, maxRadius);
    const newX = limitedDistance * Math.cos(angle);
    const newY = limitedDistance * Math.sin(angle);

    setPosition({ x: newX, y: newY });

    // Send command
    const normalizedX = (newX / maxRadius).toFixed(2);
    const normalizedY = (newY / maxRadius).toFixed(2);
    onSend(JSON.stringify({ x: normalizedX, y: normalizedY }));
  };

  const handleMouseDown = () => setIsDragging(true);
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onSend(JSON.stringify({ x: 0, y: 0 }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX, e.clientY);
  };

  return (
    <div className="p-4 bg-surface-2 rounded-lg h-full flex flex-col items-center justify-center">
      <div className="text-sm font-semibold mb-2">Movement</div>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        className="cursor-pointer"
      />
      <div className="text-xs font-mono text-text-muted mt-2">
        x: {position.x.toFixed(0)} y: {position.y.toFixed(0)}
      </div>
    </div>
  );
}
