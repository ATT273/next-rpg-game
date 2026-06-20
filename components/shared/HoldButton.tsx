"use client";
import { useEffect, useRef, useState } from "react";

interface HoldButtonProps {
  onComplete: () => void;
  holdDuration?: number;
  children: React.ReactNode;
  className?: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
  disabled?: boolean;
}

const HoldButton = ({
  onComplete,
  holdDuration = 1500,
  children,
  className = "",
  size = 48,
  strokeColor = "#1e293b",
  strokeWidth = 3,
  disabled,
}: HoldButtonProps) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress / 100);

  const startHold = () => {
    if (completedRef.current || disabled) return;
    setIsHolding(true);
    const steps = 60;
    const stepInterval = holdDuration / steps;
    const stepSize = 100 / steps;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepSize;
        if (next >= 100) {
          clearInterval(intervalRef.current!);
          completedRef.current = true;
          return 100;
        }
        return next;
      });
    }, stepInterval);
  };

  const stopHold = () => {
    if (completedRef.current) return;
    setIsHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
  };

  useEffect(() => {
    if (completedRef.current && progress >= 100) {
      const t = setTimeout(() => {
        onComplete();
        setProgress(0);
        completedRef.current = false;
        setIsHolding(false);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [progress]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"} ${className}`}
      style={{ width: size, height: size }}
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
      aria-disabled={disabled}
    >
      <svg className="absolute inset-0 -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: isHolding ? "none" : "stroke-dashoffset 0.2s ease" }}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HoldButton;
