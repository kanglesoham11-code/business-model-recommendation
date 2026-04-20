import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Antigravity-style Cursor Glow Effect
 * 
 * - Default cursor stays NORMAL (no shape change)
 * - A large, soft radial gradient spotlight follows the cursor
 * - Creates ambient illumination on the page surface
 * - Smooth spring-physics following with momentum
 * - Subtle interactive brightening on hover
 * - Gentle particle shimmer in the glow area
 */
const CustomCursor = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -500, y: -500 });
  const glowPos = useRef({ x: -500, y: -500 });
  const velocity = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isVisible = useRef(false);
  const animFrameRef = useRef(null);
  const shimmerParticles = useRef([]);
  const timeRef = useRef(0);

  const onMouseMove = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    isVisible.current = true;

    // Spawn shimmer particles occasionally
    if (Math.random() > 0.7) {
      shimmerParticles.current.push({
        x: e.clientX + (Math.random() - 0.5) * 120,
        y: e.clientY + (Math.random() - 0.5) * 120,
        size: Math.random() * 2 + 0.5,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.008,
        drift: { x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.3 },
      });
    }
  }, []);

  const onMouseEnter = useCallback(() => { isVisible.current = true; }, []);
  const onMouseLeave = useCallback(() => { isVisible.current = false; }, []);

  const onMouseOver = useCallback((e) => {
    const el = e.target;
    if (el && el.closest('a, button, [role="button"], input, select, textarea')) {
      isHovering.current = true;
    } else {
      isHovering.current = false;
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);
    timeRef.current += 0.016;

    // Spring-damper physics for smooth follow
    const stiffness = 0.06;
    const damping = 0.82;
    const dx = mousePos.current.x - glowPos.current.x;
    const dy = mousePos.current.y - glowPos.current.y;
    velocity.current.x += dx * stiffness;
    velocity.current.y += dy * stiffness;
    velocity.current.x *= damping;
    velocity.current.y *= damping;
    glowPos.current.x += velocity.current.x;
    glowPos.current.y += velocity.current.y;

    const gx = glowPos.current.x;
    const gy = glowPos.current.y;
    const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);

    if (isVisible.current) {
      // === PRIMARY GLOW — large ambient spotlight ===
      const baseRadius = isHovering.current ? 320 : 260;
      const radius = baseRadius + Math.sin(timeRef.current * 2) * 15;
      const baseAlpha = isHovering.current ? 0.09 : 0.06;
      const alpha = Math.min(baseAlpha + speed * 0.001, 0.14);

      const primaryGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, radius);
      primaryGlow.addColorStop(0, `rgba(92, 124, 250, ${alpha * 1.8})`);
      primaryGlow.addColorStop(0.25, `rgba(110, 90, 250, ${alpha * 1.2})`);
      primaryGlow.addColorStop(0.5, `rgba(130, 80, 230, ${alpha * 0.6})`);
      primaryGlow.addColorStop(0.75, `rgba(100, 120, 250, ${alpha * 0.2})`);
      primaryGlow.addColorStop(1, 'rgba(92, 124, 250, 0)');

      ctx.fillStyle = primaryGlow;
      ctx.fillRect(0, 0, w, h);

      // === SECONDARY GLOW — tighter, warmer core ===
      const coreRadius = isHovering.current ? 140 : 100;
      const coreAlpha = isHovering.current ? 0.07 : 0.04;

      const coreGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, coreRadius);
      coreGlow.addColorStop(0, `rgba(165, 140, 255, ${coreAlpha * 2})`);
      coreGlow.addColorStop(0.4, `rgba(130, 110, 250, ${coreAlpha})`);
      coreGlow.addColorStop(1, 'rgba(130, 110, 250, 0)');

      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, w, h);

      // === ACCENT GLOW — offset breathing orb ===
      const accentOffset = 30 + Math.sin(timeRef.current * 1.5) * 10;
      const accentAngle = timeRef.current * 0.8;
      const ax = gx + Math.cos(accentAngle) * accentOffset;
      const ay = gy + Math.sin(accentAngle) * accentOffset;
      const accentRadius = 80 + Math.sin(timeRef.current * 3) * 10;

      const accentGlow = ctx.createRadialGradient(ax, ay, 0, ax, ay, accentRadius);
      accentGlow.addColorStop(0, `rgba(180, 120, 255, 0.04)`);
      accentGlow.addColorStop(0.5, `rgba(140, 100, 250, 0.02)`);
      accentGlow.addColorStop(1, 'rgba(140, 100, 250, 0)');

      ctx.fillStyle = accentGlow;
      ctx.fillRect(0, 0, w, h);

      // === SHIMMER PARTICLES ===
      shimmerParticles.current.forEach((p) => {
        p.x += p.drift.x;
        p.y += p.drift.y;
        p.life -= p.decay;

        if (p.life > 0) {
          ctx.save();
          ctx.globalAlpha = p.life * 0.4;
          ctx.fillStyle = `rgba(180, 170, 255, ${p.life * 0.5})`;
          ctx.shadowColor = 'rgba(140, 120, 255, 0.3)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });
      shimmerParticles.current = shimmerParticles.current.filter((p) => p.life > 0);

      // Cap particles to prevent memory leak
      if (shimmerParticles.current.length > 60) {
        shimmerParticles.current = shimmerParticles.current.slice(-60);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Only enable on non-touch desktop
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [onMouseMove, onMouseEnter, onMouseLeave, onMouseOver, animate]);

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 99999, mixBlendMode: 'screen' }}
    />
  );
};

export default CustomCursor;
