import { useEffect, useState } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide preloader after page loads
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Compass */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Compass Circle */}
          <div className="absolute inset-0 border-8 border-black rounded-full flex items-center justify-center bg-white shadow-2xl">
            {/* Cardinal Directions */}
            <div className="absolute inset-0">
              {/* N */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-2xl">
                N
              </div>
              {/* E */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-2xl">
                E
              </div>
              {/* S */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-2xl">
                S
              </div>
              {/* W */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-2xl">
                W
              </div>
            </div>

            {/* Compass Rose - Rotating */}
            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
              <svg
                viewBox="0 0 100 100"
                className="w-32 h-32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* North Pointer (Red) */}
                <polygon
                  points="50,15 55,50 50,48 45,50"
                  fill="#E7FF00"
                  stroke="black"
                  strokeWidth="1"
                />
                {/* South Pointer (White) */}
                <polygon
                  points="50,85 55,50 50,52 45,50"
                  fill="white"
                  stroke="black"
                  strokeWidth="1"
                />
                {/* East Pointer */}
                <polygon points="85,50 50,55 52,50 50,45" fill="black" />
                {/* West Pointer */}
                <polygon points="15,50 50,55 48,50 50,45" fill="gray" />
                {/* Center Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="5"
                  fill="black"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Degree Markings */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
              (angle) => (
                <div
                  key={angle}
                  className="absolute w-0.5 h-3 bg-black top-4 left-1/2 -translate-x-1/2"
                  style={{
                    transform: `translateX(-50%) rotate(${angle}deg)`,
                    transformOrigin: "center 5.5rem",
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Loading Text */}
        <div className="font-serif text-2xl font-bold text-black">
          The Daily Truth
        </div>
        <div className="font-serif text-sm text-gray-600 mt-2">
          Loading real stories...
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
