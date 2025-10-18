import React, { useRef, useEffect } from "react";
import "./Background.css";

export default function Background({ isNight, setIsNight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w, h;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // 🌟 Stars setup
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.05 + 0.02,
      twinkle: Math.random() * 0.015 + 0.005,
    }));

    // 💫 Shooting stars
    let shootingStars = [];
    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.3,
        len: Math.random() * 80 + 80,
        speed: Math.random() * 8 + 6,
        size: Math.random() * 1 + 0.5,
        life: 0,
        maxLife: 60,
      });
    };
    const shootingStarInterval = setInterval(
      () => createShootingStar(),
      6000 + Math.random() * 4000
    );

    // ☁️ Clouds for day
    const clouds = Array.from({ length: 6 }, () => ({
      x: Math.random() * w,
      y: Math.random() * (h * 0.5),
      width: 250 + Math.random() * 250,
      height: 90 + Math.random() * 40,
      speed: 0.08 + Math.random() * 0.1,
      opacity: 0.12 + Math.random() * 0.15,
    }));

    // 🌫️ Fog particles for night
    const fogParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: h * 0.8 + Math.random() * (h * 0.2),
      r: 100 + Math.random() * 200,
      speed: 0.15 + Math.random() * 0.1,
      opacity: 0.02 + Math.random() * 0.03,
    }));

    // 🌈 Animation Loop
    const draw = () => {
      // Gradient background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      if (isNight) {
        bg.addColorStop(0, "#050915");
        bg.addColorStop(1, "#0b132b");
      } else {
        bg.addColorStop(0, "#72c9ff");
        bg.addColorStop(0.7, "#b3e3ff");
        bg.addColorStop(1, "#fff9e6");
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // 🌕 Celestial body (moon/sun)
      const celestialX = w * 0.9;
      const celestialY = h * 0.18;
      const celestialR = isNight ? 55 : 70;

      const grad = ctx.createRadialGradient(
        celestialX,
        celestialY,
        celestialR * 0.4,
        celestialX,
        celestialY,
        celestialR
      );
      if (isNight) {
        grad.addColorStop(0, "#fffbe6");
        grad.addColorStop(0.5, "#f5e8b8");
        grad.addColorStop(1, "#d1c48d");
      } else {
        grad.addColorStop(0, "#fff1a1");
        grad.addColorStop(0.6, "#ffe259");
        grad.addColorStop(1, "#f6d365");
      }

      ctx.beginPath();
      ctx.arc(celestialX, celestialY, celestialR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // ✨ Celestial glow
      const glow = ctx.createRadialGradient(
        celestialX,
        celestialY,
        celestialR,
        celestialX,
        celestialY,
        celestialR * 3
      );
      glow.addColorStop(
        0,
        isNight ? "rgba(255,255,220,0.25)" : "rgba(255,255,180,0.3)"
      );
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(celestialX, celestialY, celestialR * 3, 0, Math.PI * 2);
      ctx.fill();

      // 🌟 Stars animation
      if (isNight) {
        for (let s of stars) {
          s.alpha += s.twinkle * (Math.random() < 0.5 ? -1 : 1);
          s.alpha = Math.max(0.2, Math.min(1, s.alpha));
          s.x -= s.speed;
          if (s.x < 0) s.x = w;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
          ctx.fill();
        }
      } else {
        // ☁️ Clouds animation
        for (let c of clouds) {
          c.x += c.speed;
          if (c.x - c.width > w) c.x = -c.width;
          const cloudGrad = ctx.createLinearGradient(
            c.x,
            c.y,
            c.x + c.width,
            c.y + c.height
          );
          cloudGrad.addColorStop(0, `rgba(255,255,255,${c.opacity})`);
          cloudGrad.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.fillStyle = cloudGrad;
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, c.width, c.height, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 🌠 Shooting stars
      shootingStars = shootingStars.filter((s) => s.life < s.maxLife);
      for (let s of shootingStars) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = s.size;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y + s.len / 2);
        ctx.stroke();

        s.x += s.speed;
        s.y -= s.speed / 2;
        s.life++;
      }

      // 🌫️ Fog (night)
      if (isNight) {
        for (let f of fogParticles) {
          f.x += f.speed * (Math.random() < 0.5 ? -1 : 1);
          if (f.x < -f.r) f.x = w + f.r;
          if (f.x > w + f.r) f.x = -f.r;
          const fogGrad = ctx.createRadialGradient(
            f.x,
            f.y,
            f.r * 0.3,
            f.x,
            f.y,
            f.r
          );
          fogGrad.addColorStop(0, `rgba(255,255,255,${f.opacity})`);
          fogGrad.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.fillStyle = fogGrad;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    // Cleanup
    return () => {
      clearInterval(shootingStarInterval);
      window.removeEventListener("resize", resize);
    };
  }, [isNight]);

  return (
    <>
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      <button
        className="toggle-btn"
        onClick={() => setIsNight(!isNight)}
        title="Toggle Day/Night Mode"
      >
        {isNight ? "☀️" : "🌙"}
      </button>
    </>
  );
}
