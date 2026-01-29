import { useEffect, useState } from 'react';
import { Waves } from 'lucide-react';

export function LoadingScreen() {
    const [opacity, setOpacity] = useState(1);

    // Fade out effect after 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setOpacity(0);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 transition-opacity duration-1000"
            style={{ opacity }}
        >
            {/* Dark Textured Background */}
            <div className="absolute inset-0 bg-sand-900">
                {/* Subtle Wave Pattern Texture - Tone on Tone */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-10"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path
                                d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                                fill="currentColor"
                                fillOpacity="0.15"
                                className="text-sand-800"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#wave-pattern)" />
                </svg>

                {/* Additional Wave Layers for Depth */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand-800/30 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-teal-950/20 to-transparent" />
            </div>

            {/* Centered Logo with Pulse Animation */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                {/* Logo Container - Turquoise Gradient Glow */}
                <div className="relative">
                    {/* Glow Effect Behind */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-600/30 to-coral-500/30 rounded-full blur-3xl scale-150 animate-pulse" />

                    {/* Main Logo */}
                    <div className="relative bg-gradient-to-br from-teal-600 to-teal-500 p-8 rounded-3xl shadow-2xl shadow-teal-600/50 animate-pulse">
                        <Waves className="w-24 h-24 text-white" strokeWidth={2.5} />
                    </div>
                </div>

                {/* App Name */}
                <h1 className="mt-8 text-4xl font-black tracking-tight">
                    <span className="text-teal-600">PISTA </span>
                    <span className="text-coral-500">RESENHA</span>
                </h1>
                <p className="mt-2 text-sm font-bold text-sand-400 uppercase tracking-wide">
                    Beach Tennis Arena
                </p>

                {/* Minimalist Loading Indicator - Wave Formation */}
                <div className="mt-12 flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"
                            style={{
                                animationDelay: `${i * 0.15}s`,
                                animationDuration: '0.8s',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
