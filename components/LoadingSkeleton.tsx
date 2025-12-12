'use client';

interface SkeletonProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`card-ultra p-6 md:p-12 rounded-2xl md:rounded-[2.5rem] animate-pulse ${className}`}>
      <div className="h-8 bg-gray-200 rounded-xl w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-lg w-5/6 mb-4"></div>
      <div className="h-48 bg-gray-200 rounded-xl"></div>
    </div>
  );
}

export function SkeletonPlantCard({ className = '' }: SkeletonProps) {
  return (
    <div className={`card-ultra rounded-2xl overflow-hidden animate-pulse ${className}`}>
      <div className="h-64 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded-lg w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-4/5"></div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid md:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPlantCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHeader({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-12 bg-gray-200 rounded-xl w-1/3 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-lg w-2/3"></div>
    </div>
  );
}

