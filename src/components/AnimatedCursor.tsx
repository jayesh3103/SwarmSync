import React, { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

const AnimatedCursor: React.FC = () => {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<CursorPosition[]>([]);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setCursorPos(newPos);
      
      // Update trail
      setTrail(prev => {
        const newTrail = [newPos, ...prev.slice(0, 8)];
        return newTrail;
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.matches('button, a, [role="button"], .cursor-pointer, input, textarea, select');
      setIsHovering(isInteractive);
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Hide on mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) return null;

  return (
    <>
      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
        button, a, [role="button"], .cursor-pointer, input, textarea, select {
          cursor: none !important;
        }
      `}</style>

      {/* Main 3D Cursor */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Outer Ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
            isHovering 
              ? 'w-12 h-12 border-cyan-400 bg-cyan-400/20' 
              : 'w-8 h-8 border-white/60'
          } ${
            isClicking ? 'scale-75' : 'scale-100'
          }`}
          style={{
            transform: `translate(-50%, -50%) scale(${isClicking ? 0.75 : 1}) rotateZ(${Date.now() * 0.001}rad)`,
            boxShadow: isHovering ? '0 0 20px #06b6d4' : '0 0 10px rgba(255,255,255,0.3)',
          }}
        />

        {/* Inner Core */}
        <div
          className={`absolute w-2 h-2 rounded-full transition-all duration-200 ${
            isHovering ? 'bg-cyan-400' : 'bg-white'
          } ${
            isClicking ? 'scale-150' : 'scale-100'
          }`}
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: isHovering ? '0 0 15px #06b6d4' : '0 0 8px rgba(255,255,255,0.5)',
          }}
        />

        {/* 3D Orbital Elements */}
        {[0, 120, 240].map((rotation, i) => (
          <div
            key={i}
            className="absolute w-6 h-6"
            style={{
              transform: `translate(-50%, -50%) rotateZ(${rotation + Date.now() * 0.002}deg)`,
            }}
          >
            <div
              className={`w-1 h-1 rounded-full ${
                isHovering ? 'bg-purple-400' : 'bg-white/40'
              }`}
              style={{
                position: 'absolute',
                top: '0%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: isHovering ? '0 0 8px #a855f7' : '0 0 4px rgba(255,255,255,0.3)',
              }}
            />
          </div>
        ))}

        {/* Hover State Particles */}
        {isHovering && (
          <>
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-20px)`,
                  animationDelay: `${i * 100}ms`,
                  boxShadow: '0 0 6px #06b6d4',
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Cursor Trail */}
      {trail.map((pos, i) => (
        <div
          key={i}
          className="fixed pointer-events-none z-[9998] w-1 h-1 bg-cyan-400/60 rounded-full"
          style={{
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
            opacity: (8 - i) / 8,
            scale: (8 - i) / 8,
            boxShadow: '0 0 4px #06b6d4',
          }}
        />
      ))}

      {/* Click Ripple Effect */}
      {isClicking && (
        <div
          className="fixed pointer-events-none z-[9997] rounded-full border border-cyan-400 animate-ping"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            boxShadow: '0 0 20px #06b6d4',
          }}
        />
      )}
    </>
  );
};

export default AnimatedCursor;