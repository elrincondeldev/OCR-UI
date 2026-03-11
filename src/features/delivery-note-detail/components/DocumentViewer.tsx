import { useRef, useState, useEffect, useCallback } from 'react';

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 12;
const WHEEL_FACTOR = 1.15;

export function DocumentViewer({ src, alt = 'Document' }: { src: string; alt?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [tf, setTf] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  // Keep a ref to latest tf so drag handlers never close over stale state
  const tfRef = useRef(tf);
  tfRef.current = tf;

  const drag = useRef<{ sx: number; sy: number; stx: number; sty: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  // Fit image to container width on load
  const fitToWidth = useCallback(() => {
    const c = containerRef.current;
    const img = imgRef.current;
    if (!c || !img?.naturalWidth) return;
    const scale = Math.min(c.clientWidth / img.naturalWidth, 1);
    const x = (c.clientWidth - img.naturalWidth * scale) / 2;
    setTf({ scale, x, y: 12 });
  }, []);

  // Non-passive wheel listener so we can preventDefault and stop page scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      // Cursor position relative to container
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      setTf((prev) => {
        const factor = e.deltaY < 0 ? WHEEL_FACTOR : 1 / WHEEL_FACTOR;
        const newScale = Math.min(Math.max(prev.scale * factor, MIN_SCALE), MAX_SCALE);
        const ratio = newScale / prev.scale;
        // Anchor zoom to cursor: keep the image point under cursor fixed
        return {
          scale: newScale,
          x: cx + (prev.x - cx) * ratio,
          y: cy + (prev.y - cy) * ratio,
        };
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setDragging(true);
    drag.current = {
      sx: e.clientX,
      sy: e.clientY,
      stx: tfRef.current.x,
      sty: tfRef.current.y,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current) return;
    setTf((prev) => ({
      ...prev,
      x: drag.current!.stx + e.clientX - drag.current!.sx,
      y: drag.current!.sty + e.clientY - drag.current!.sy,
    }));
  };

  const stopDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  // Double-click resets view
  const onDoubleClick = () => fitToWidth();

  const zoomBy = (factor: number) =>
    setTf((prev) => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * factor, MIN_SCALE), MAX_SCALE),
    }));

  const pct = Math.round(tf.scale * 100);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-neutral-300 select-none">
      {/* Viewport */}
      <div
        ref={containerRef}
        className={`flex-1 overflow-hidden ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onDoubleClick={onDoubleClick}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          onLoad={fitToWidth}
          style={{
            transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.scale})`,
            transformOrigin: '0 0',
            maxWidth: 'none',
            willChange: 'transform',
          }}
          className="block rounded shadow-lg"
        />
      </div>

      {/* Floating toolbar */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gray-900/80 px-3 py-1.5 text-white shadow-xl backdrop-blur-sm">
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => zoomBy(1 / 1.25)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-base leading-none hover:bg-white/20"
          title="Zoom out (scroll down)"
        >
          −
        </button>

        <span className="min-w-[3.5rem] text-center text-xs tabular-nums">{pct}%</span>

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => zoomBy(1.25)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-base leading-none hover:bg-white/20"
          title="Zoom in (scroll up)"
        >
          +
        </button>

        <div className="mx-1 h-3 w-px bg-white/25" />

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={fitToWidth}
          className="rounded-full px-2 py-0.5 text-xs hover:bg-white/20"
          title="Fit to width (double-click)"
        >
          Fit
        </button>
      </div>
    </div>
  );
}
