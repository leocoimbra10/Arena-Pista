import React, { useState } from 'react';
import {
    Trophy,
    Calendar,
    Users,
    Sun,
    CloudRain,
    ChevronRight,
    Activity,
    Zap,
    ArrowRight,
    Menu,
    Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
type ViewState = 'welcome' | 'dashboard' | 'booking' | 'partner' | 'admin';
type SportType = 'beach-tennis' | 'footvolley' | 'volleyball';
type WeatherStatus = 'sunny' | 'cloudy' | 'rainy';

interface Court {
    id: string;
    name: string;
    status: 'available' | 'in-game' | 'maintenance';
    currentMatch?: {
        score: string; // "6-4"
        set1: string;
        set2: string;
        teamA: string;
        teamB: string;
        serving: 'A' | 'B';
    };
    nextFreeSlot?: string;
}

// --- Mock Data ---
const MOCK_COURTS: Court[] = [
    {
        id: '1',
        name: 'Arena Alpha',
        status: 'in-game',
        currentMatch: {
            score: '15-40',
            set1: '6-4',
            set2: '4-5',
            teamA: 'Silva / Costa',
            teamB: 'Santos / Oliveira',
            serving: 'B',
        },
    },
    {
        id: '2',
        name: 'Arena Beta',
        status: 'available',
        nextFreeSlot: '14:30',
    },
    {
        id: '3',
        name: 'Arena Gamma',
        status: 'available',
        nextFreeSlot: 'Now',
    },
];

const WEATHER_DATA = {
    temp: 28,
    condition: 'sunny' as WeatherStatus,
    wind: '12km/h',
    suitable: true,
};

// --- Components ---

const NeonButton = ({
    children,
    variant = 'primary',
    className,
    onClick,
    icon: Icon
}: {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    className?: string;
    onClick?: () => void;
    icon?: React.ElementType;
}) => {
    const baseStyle = "relative overflow-hidden font-black uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-[#CCFF00] text-black hover:bg-[#bbe600] shadow-[0_0_20px_rgba(204,255,0,0.4)] hover:shadow-[0_0_30px_rgba(204,255,0,0.6)] rounded-[2.5rem] px-8 py-4 text-sm md:text-base",
        secondary: "bg-[#007AFF] text-white hover:bg-[#006bd1] shadow-[0_0_20px_rgba(0,122,255,0.4)] hover:shadow-[0_0_30px_rgba(0,122,255,0.6)] rounded-[2.5rem] px-8 py-4 text-sm md:text-base",
        ghost: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-[2.5rem] px-6 py-3 text-xs md:text-sm",
        outline: "border-2 border-white/20 hover:border-[#CCFF00] hover:text-[#CCFF00] text-white bg-transparent rounded-[2.5rem] px-6 py-3 text-xs md:text-sm"
    };

    return (
        <button onClick={onClick} className={cn(baseStyle, variants[variant], className)}>
            {children}
            {Icon && <Icon className="w-5 h-5" />}
        </button>
    );
};

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-xl", className)}>
        {children}
    </div>
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="mb-6">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            {title} <span className="text-[#CCFF00]">.</span>
        </h2>
        {subtitle && <p className="text-white/60 text-sm font-medium tracking-wide mt-1">{subtitle}</p>}
    </div>
);

// --- Views ---

const WelcomeView = ({ onStart }: { onStart: () => void }) => (
    <div className="min-h-screen relative overflow-hidden bg-black flex flex-col items-center justify-end pb-12 md:pb-24 px-6">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0">
            <img
                src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2807&auto=format&fit=crop"
                alt="Beach Tennis Action"
                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000 transform hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#007AFF] flex items-center justify-center shadow-[0_0_20px_rgba(0,122,255,0.5)]">
                        <Zap className="w-7 h-7 text-white fill-current" />
                    </div>
                    <span className="text-[#007AFF] font-bold tracking-widest text-xs uppercase bg-[#007AFF]/10 px-3 py-1 rounded-full border border-[#007AFF]/20">
                        Beta v2.0
                    </span>
                </div>
                <h1 className="text-6xl md:text-7xl font-black text-white italic tracking-tighter leading-[0.9]">
                    NEON<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#007AFF]">
                        ARENA
                    </span>
                </h1>
                <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-xs">
                    The future of sand sports management. Book courts, find matches, and track stats in real-time.
                </p>
            </div>

            <div className="space-y-4">
                <NeonButton onClick={onStart} className="w-full h-16 text-lg" icon={ArrowRight}>
                    Get Started
                </NeonButton>
                <p className="text-center text-xs text-gray-600 uppercase tracking-widest font-bold">
                    Join 2,400+ Athletes
                </p>
            </div>
        </div>
    </div>
);

const DashboardView = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
    const [activeSport, setActiveSport] = useState<SportType>('beach-tennis');

    return (
        <div className="min-h-screen bg-black text-white pb-32">
            {/* Header */}
            <div className="bg-[#007AFF] rounded-b-[3rem] p-6 pb-12 pt-12 shadow-[0_10px_40px_rgba(0,122,255,0.3)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Activity className="w-64 h-64 text-white rotate-12" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden">
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                            </div>
                            <div>
                                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Welcome back</p>
                                <h3 className="text-2xl font-black italic">Alex Hunter</h3>
                            </div>
                        </div>
                        <button className="p-3 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-all">
                            <Bell className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Calendar Strip */}
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {['Mon 12', 'Tue 13', 'Wed 14', 'Thu 15', 'Fri 16'].map((date, i) => (
                            <button
                                key={date}
                                className={cn(
                                    "flex-shrink-0 w-16 h-24 rounded-[2rem] flex flex-col items-center justify-center gap-1 transition-all",
                                    i === 0
                                        ? "bg-[#CCFF00] text-black shadow-lg scale-105"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                <span className="text-xs font-bold uppercase opacity-60">{date.split(' ')[0]}</span>
                                <span className="text-xl font-black">{date.split(' ')[1]}</span>
                                {i === 2 && <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-8 relative z-20 space-y-8">

                {/* Weather Guard */}
                <GlassCard className="flex items-center justify-between !py-4 !px-6 bg-black/80 border-[#CCFF00]/30 shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#CCFF00]/10 rounded-full">
                            {WEATHER_DATA.condition === 'sunny' ? (
                                <Sun className="w-6 h-6 text-[#CCFF00]" />
                            ) : (
                                <CloudRain className="w-6 h-6 text-[#007AFF]" />
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Court Condition</p>
                            <p className="text-lg font-black text-white">Perfect for Play</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-[#CCFF00]">{WEATHER_DATA.temp}°</p>
                        <p className="text-xs text-gray-500 font-bold">{WEATHER_DATA.wind}</p>
                    </div>
                </GlassCard>

                {/* Sport Filters */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                    {['beach-tennis', 'footvolley', 'volleyball'].map((sport) => (
                        <button
                            key={sport}
                            onClick={() => setActiveSport(sport as SportType)}
                            className={cn(
                                "px-6 py-3 rounded-full text-sm font-black uppercase tracking-wide whitespace-nowrap transition-all border-2",
                                activeSport === sport
                                    ? "bg-transparent border-[#CCFF00] text-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.3)]"
                                    : "bg-transparent border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
                            )}
                        >
                            {sport.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {/* Live Courts */}
                <section>
                    <SectionTitle title="Live Action" subtitle="Current arena status" />
                    <div className="space-y-4">
                        {MOCK_COURTS.map((court) => (
                            <GlassCard key={court.id} className="group hover:border-[#007AFF]/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-3 h-3 rounded-full animate-pulse",
                                            court.status === 'in-game' ? "bg-red-500" : "bg-[#CCFF00]"
                                        )} />
                                        <h3 className="text-xl font-black italic text-white">{court.name}</h3>
                                    </div>
                                    {court.status === 'available' && (
                                        <span className="px-3 py-1 bg-[#CCFF00]/10 text-[#CCFF00] text-xs font-bold uppercase rounded-full border border-[#CCFF00]/20">
                                            Free Now
                                        </span>
                                    )}
                                </div>

                                {court.status === 'in-game' && court.currentMatch ? (
                                    <div className="bg-black/40 rounded-3xl p-4 border border-white/5">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-left">
                                                <p className={cn("text-sm font-bold", court.currentMatch.serving === 'A' ? "text-[#CCFF00]" : "text-gray-400")}>
                                                    {court.currentMatch.teamA} {court.currentMatch.serving === 'A' && '🎾'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn("text-sm font-bold", court.currentMatch.serving === 'B' ? "text-[#CCFF00]" : "text-gray-400")}>
                                                    {court.currentMatch.teamB} {court.currentMatch.serving === 'B' && '🎾'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center gap-4 text-3xl font-black italic">
                                            <span className="text-gray-600">{court.currentMatch.set1}</span>
                                            <span className="text-[#CCFF00] scale-110">{court.currentMatch.set2}</span>
                                            <div className="px-3 py-1 bg-[#007AFF] text-white text-sm not-italic rounded-lg shadow-lg">
                                                {court.currentMatch.score}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <p className="text-gray-400 text-sm font-medium">
                                            Next slot: <span className="text-white font-bold">{court.nextFreeSlot}</span>
                                        </p>
                                        <NeonButton variant="secondary" className="!px-6 !py-2 !text-xs" onClick={() => onNavigate('booking')}>
                                            Book Now
                                        </NeonButton>
                                    </div>
                                )}
                            </GlassCard>
                        ))}
                    </div>
                </section>

                {/* Partner Match Widget */}
                <section>
                    <div className="p-1 rounded-[3rem] bg-gradient-to-r from-[#007AFF] to-[#CCFF00]">
                        <div className="bg-black rounded-[2.8rem] p-6 text-center">
                            <Users className="w-10 h-10 text-white mx-auto mb-4" />
                            <h3 className="text-xl font-black text-white italic mb-2">Need a Partner?</h3>
                            <p className="text-gray-400 text-sm mb-6">Find active players near your level.</p>
                            <button
                                onClick={() => onNavigate('partner')}
                                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-[2rem] text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                Match Now <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default function NeonDashboard() {
    const [view, setView] = useState<ViewState>('welcome');

    if (view === 'welcome') {
        return <WelcomeView onStart={() => setView('dashboard')} />;
    }

    return (
        <div className="bg-black min-h-screen font-sans selection:bg-[#CCFF00] selection:text-black">
            <DashboardView onNavigate={setView} />

            {/* Floating Dock Navigation */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10" />
                <div className="relative flex justify-around items-center p-2">
                    <button onClick={() => setView('dashboard')} className={cn("p-4 rounded-full transition-all", view === 'dashboard' ? "bg-[#007AFF] text-white shadow-[0_0_20px_rgba(0,122,255,0.5)]" : "text-gray-500 hover:text-white")}>
                        <Activity className="w-6 h-6" />
                    </button>
                    <button onClick={() => setView('booking')} className={cn("p-4 rounded-full transition-all", view === 'booking' ? "bg-[#007AFF] text-white shadow-[0_0_20px_rgba(0,122,255,0.5)]" : "text-gray-500 hover:text-white")}>
                        <Calendar className="w-6 h-6" />
                    </button>

                    {/* Expanded Trophy Button */}
                    <button className="bg-[#CCFF00] text-black p-4 rounded-[2rem] -mt-8 shadow-[0_0_30px_rgba(204,255,0,0.5)] border-4 border-black transition-transform hover:scale-110 active:scale-95">
                        <Trophy className="w-8 h-8 fill-current" />
                    </button>

                    <button onClick={() => setView('partner')} className={cn("p-4 rounded-full transition-all", view === 'partner' ? "bg-[#007AFF] text-white shadow-[0_0_20px_rgba(0,122,255,0.5)]" : "text-gray-500 hover:text-white")}>
                        <Users className="w-6 h-6" />
                    </button>
                    <button onClick={() => setView('admin')} className={cn("p-4 rounded-full transition-all", view === 'admin' ? "bg-[#007AFF] text-white shadow-[0_0_20px_rgba(0,122,255,0.5)]" : "text-gray-500 hover:text-white")}>
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
