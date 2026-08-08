import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="w-full animate-pulse min-h-[500px]">
      <div className="mb-8">
        <div className="h-8 w-64 bg-stone-200 rounded-lg mb-3"></div>
        <div className="h-4 w-96 max-w-full bg-stone-100 rounded"></div>
      </div>
      <div className="w-full flex flex-col lg:flex-row bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-stone-200 gap-10">
        <div className="flex-1 flex flex-col space-y-6">
          <div className="h-10 w-full bg-stone-100 rounded-xl"></div>
          <div className="h-10 w-full bg-stone-100 rounded-xl"></div>
          <div className="h-10 w-full bg-stone-100 rounded-xl"></div>
        </div>
        <div className="flex-1 hidden lg:block bg-stone-50 rounded-xl min-h-[280px]"></div>
      </div>
    </div>
  );
}
