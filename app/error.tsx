"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-lg text-center">
            <h2 className="text-white text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-[#92adc9] mb-6">{error.message || "An unexpected error occurred."}</p>
            <button
              onClick={reset}
              className="rounded-lg h-10 px-4 bg-[#1172d4] text-white text-sm font-bold"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}


