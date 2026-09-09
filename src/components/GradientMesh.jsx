import { useEffect, useRef } from "react";

// Lightweight animated blob-mesh gradient, no external deps.
export default function GradientMesh({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const blobs = [
      { x: 0.25, y: 0.35, r: 0.5, dx: 0.00012, dy: 0.00009, color: "255,107,74" },
      { x: 0.7, y: 0.25, r: 0.42, dx: -0.00009, dy: 0.00013, color: "255,166,48" },
      { x: 0.55, y: 0.7, r: 0.45, dx: 0.00007, dy: -0.0001, color: "255,138,61" },
    ];

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.filter = "blur(60px)";
      for (const b of blobs) {
        const x = (b.x + Math.sin(t * b.dx * 100) * 0.06) * w;
        const y = (b.y + Math.cos(t * b.dy * 100) * 0.06) * h;
        const r = b.r * Math.max(w, h);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${b.color},0.55)`);
        grad.addColorStop(1, `rgba(${b.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      t += 1;
      if (!prefersReduced) raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
