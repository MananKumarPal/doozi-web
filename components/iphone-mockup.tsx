'use client';

import { Heart, MapPin, Bookmark } from 'lucide-react';

export default function PhoneMockup() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      <div className="relative">
        <div className="relative w-[320px] h-[640px] bg-black rounded-[3rem] p-2 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[30px] bg-black rounded-b-3xl z-20"></div>
          
          <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
            <iframe
              src="/auth/signup-iframe"
              className="w-full h-full border-0"
              title="Doozi Signup"
            />
          </div>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-gray-800 rounded-full z-20"></div>
        </div>

        <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-full p-4 animate-float">
          <Heart className="text-white h-8 w-8" />
        </div>
        <div className="absolute top-1/2 -left-8 bg-white/20 backdrop-blur-sm rounded-full p-4 animate-float" style={{ animationDelay: '1s' }}>
          <MapPin className="text-white h-8 w-8" />
        </div>
        <div className="absolute -bottom-12 right-8 bg-white/20 backdrop-blur-sm rounded-full p-4 animate-float" style={{ animationDelay: '2s' }}>
          <Bookmark className="text-white h-8 w-8" />
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(-8px) rotate(-4deg);
          }
          50% {
            transform: translateY(8px) rotate(4deg);
          }
        }
        :global(.animate-float) {
          animation: float 7.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
