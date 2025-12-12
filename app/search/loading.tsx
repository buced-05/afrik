import { SkeletonList, SkeletonHeader } from '@/components/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="decorative-circle decorative-circle-1"></div>
      <div className="decorative-circle decorative-circle-2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <SkeletonHeader className="mb-8" />
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded-xl w-full max-w-2xl mx-auto animate-pulse"></div>
        </div>
        <SkeletonList count={6} />
      </div>
    </div>
  );
}
