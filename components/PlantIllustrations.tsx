'use client';

import React from 'react';

interface PlantIllustrationProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'leaf' | 'plant' | 'flower' | 'herb';
}

const sizeClasses = {
  small: 'w-16 h-16',
  medium: 'w-24 h-24',
  large: 'w-32 h-32',
};

export function LeafIllustration({ className = '', size = 'medium', variant = 'leaf' }: PlantIllustrationProps) {
  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 80 C70 80, 85 65, 85 45 C85 25, 70 10, 50 10 Z"
        fill="currentColor"
        fillOpacity="0.4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.7"
      />
      <path
        d="M50 15 L50 75 M35 30 L65 30 M35 50 L65 50 M35 70 L65 70"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PlantIllustration({ className = '', size = 'medium' }: PlantIllustrationProps) {
  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <line
        x1="50"
        y1="20"
        x2="50"
        y2="80"
        stroke="currentColor"
        strokeWidth="4"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <ellipse
        cx="30"
        cy="35"
        rx="12"
        ry="20"
        fill="currentColor"
        fillOpacity="0.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.8"
        transform="rotate(-30 30 35)"
      />
      <ellipse
        cx="70"
        cy="35"
        rx="12"
        ry="20"
        fill="currentColor"
        fillOpacity="0.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.8"
        transform="rotate(30 70 35)"
      />
      <ellipse
        cx="30"
        cy="55"
        rx="12"
        ry="20"
        fill="currentColor"
        fillOpacity="0.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.8"
        transform="rotate(-45 30 55)"
      />
      <ellipse
        cx="70"
        cy="55"
        rx="12"
        ry="20"
        fill="currentColor"
        fillOpacity="0.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.8"
        transform="rotate(45 70 55)"
      />
      {/* Flower/Head */}
      <circle
        cx="50"
        cy="20"
        r="8"
        fill="currentColor"
        fillOpacity="0.6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.9"
      />
    </svg>
  );
}

export function FlowerIllustration({ className = '', size = 'medium' }: PlantIllustrationProps) {
  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Petals */}
      <ellipse
        cx="50"
        cy="30"
        rx="8"
        ry="15"
        fill="currentColor"
        fillOpacity="0.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.8"
      />
      <ellipse
        cx="50"
        cy="70"
        rx="8"
        ry="15"
        fill="currentColor"
        fillOpacity="0.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.8"
      />
      <ellipse
        cx="30"
        cy="50"
        rx="15"
        ry="8"
        fill="currentColor"
        fillOpacity="0.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.8"
      />
      <ellipse
        cx="70"
        cy="50"
        rx="15"
        ry="8"
        fill="currentColor"
        fillOpacity="0.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.8"
      />
      {/* Center */}
      <circle
        cx="50"
        cy="50"
        r="10"
        fill="currentColor"
        fillOpacity="0.6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.9"
      />
      {/* Stem */}
      <line
        x1="50"
        y1="60"
        x2="50"
        y2="85"
        stroke="currentColor"
        strokeWidth="4"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HerbIllustration({ className = '', size = 'medium' }: PlantIllustrationProps) {
  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main stem */}
      <line
        x1="50"
        y1="15"
        x2="50"
        y2="85"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      {/* Small branches */}
      <line
        x1="50"
        y1="25"
        x2="35"
        y2="30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="25"
        x2="65"
        y2="30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="40"
        x2="35"
        y2="45"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="40"
        x2="65"
        y2="45"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="55"
        x2="35"
        y2="60"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="50"
        y1="55"
        x2="65"
        y2="60"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      {/* Small leaves */}
      <circle
        cx="35"
        cy="30"
        r="5"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <circle
        cx="65"
        cy="30"
        r="5"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <circle
        cx="35"
        cy="45"
        r="5"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <circle
        cx="65"
        cy="45"
        r="5"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <circle
        cx="35"
        cy="60"
        r="5"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <circle
        cx="65"
        cy="60"
        r="5"
        fill="currentColor"
        fillOpacity="0.5"
      />
    </svg>
  );
}

// Decorative wrapper component - Only in empty edge areas
export function DecorativePlants({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* Only a few subtle illustrations in the far corners and edges, away from content */}
      <div className="hidden lg:block absolute top-4 left-4 text-green-600 opacity-40">
        <LeafIllustration size="small" />
      </div>
      <div className="hidden lg:block absolute top-4 right-4 text-green-500 opacity-40">
        <PlantIllustration size="small" />
      </div>
      <div className="hidden lg:block absolute bottom-4 left-4 text-green-600 opacity-40">
        <FlowerIllustration size="small" />
      </div>
      <div className="hidden lg:block absolute bottom-4 right-4 text-green-500 opacity-40">
        <HerbIllustration size="small" />
      </div>
    </div>
  );
}

