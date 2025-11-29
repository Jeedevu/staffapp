
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldExclamationIcon } from './icons/Icons';

const EmergencySlider: React.FC = () => {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [progress, setProgress] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasVibrated = useRef(false);

  // Haptic feedback helper
  const triggerHaptic = (pattern: 'start' | 'progress' | 'success') => {
    if ('vibrate' in navigator) {
      switch (pattern) {
        case 'start':
          navigator.vibrate(50);
          break;
        case 'progress':
          navigator.vibrate(10);
          break;
        case 'success':
          navigator.vibrate([100, 50, 100]);
          break;
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    hasVibrated.current = false;
    sliderRef.current?.setPointerCapture(e.pointerId);
    triggerHaptic('start');
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current || !sliderRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const sliderWidth = sliderRef.current.offsetWidth;
    let newX = e.clientX - containerRect.left - sliderWidth / 2;

    newX = Math.max(0, newX);
    newX = Math.min(newX, containerRect.width - sliderWidth);

    // Calculate progress percentage
    const progressPercent = (newX / (containerRect.width - sliderWidth)) * 100;
    setProgress(progressPercent);
    setSliderPosition(newX);

    // Haptic feedback at 50% and 90% thresholds
    if ((progressPercent > 50 && progressPercent < 55) || (progressPercent > 90 && progressPercent < 95)) {
      if (!hasVibrated.current) {
        triggerHaptic('progress');
        hasVibrated.current = true;
      }
    } else if (progressPercent < 50 || (progressPercent > 55 && progressPercent < 90)) {
      hasVibrated.current = false;
    }

    // Trigger emergency when slider reaches the end (with 10px tolerance)
    if (newX >= containerRect.width - sliderWidth - 10) {
      setUnlocked(true);
      isDragging.current = false;
      triggerHaptic('success');
      setTimeout(() => {
        navigate('/emergency');
      }, 200); // Small delay for visual feedback
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

    isDragging.current = false;
    sliderRef.current?.releasePointerCapture(e.pointerId);

    if (!unlocked) {
      setSliderPosition(0);
      setProgress(0);
    }
  };

  // Dynamic colors based on progress
  const backgroundColor = progress > 90 ? 'bg-red-600' : progress > 50 ? 'bg-red-700' : 'bg-red-800';
  const glowIntensity = Math.min(progress / 100, 1);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`w-full ${backgroundColor} rounded-full p-2 flex items-center relative select-none cursor-pointer transition-all duration-300 overflow-hidden`}
      style={{
        boxShadow: `0 0 ${glowIntensity * 20}px rgba(239, 68, 68, ${glowIntensity * 0.8})`
      }}
    >
      {/* Progress fill background */}
      <div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-100"
        style={{
          width: `${progress}%`,
          opacity: 0.6
        }}
      />

      {/* Slider handle */}
      <div
        ref={sliderRef}
        onPointerDown={handlePointerDown}
        className="bg-white rounded-full p-3 shadow-lg z-10 touch-none relative"
        style={{
          transform: `translateX(${sliderPosition}px) scale(${1 + glowIntensity * 0.1})`,
          transition: isDragging.current ? 'transform 0.05s ease-out' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: `0 0 ${glowIntensity * 15}px rgba(239, 68, 68, ${glowIntensity})`
        }}
      >
        <ShieldExclamationIcon
          className="w-8 h-8 text-red-600 transition-transform duration-200"
          style={{
            transform: `rotate(${progress * 3.6}deg)` // Rotate icon as progress increases
          }}
        />
      </div>

      {/* Dynamic text */}
      <span
        className="absolute left-0 right-0 text-center text-white font-bold text-lg pointer-events-none transition-all duration-300"
        style={{
          opacity: progress > 70 ? 0.5 : 1,
          transform: `scale(${1 - glowIntensity * 0.1})`
        }}
      >
        {progress > 90 ? '🚨 Release to Trigger! 🚨' : progress > 50 ? 'Keep Sliding...' : 'Swipe for Emergency'}
      </span>

      {/* Pulse effect when near completion */}
      {progress > 90 && (
        <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse pointer-events-none" style={{ opacity: 0.3 }} />
      )}
    </div>
  );
};

export default EmergencySlider;
