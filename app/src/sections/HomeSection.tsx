import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  Trophy,
  Users,
  Target,
  ChevronRight,
  Activity,
  Bell,
  UserPlus,
  Calendar as CalendarIcon,
  Star,
  MapPin
} from 'lucide-react';
import { useRanking } from '@/hooks/useFirestore';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Tab = 'tracker' | 'lobby' | 'torneios' | 'profs';

export function HomeSection({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { userData } = useAuth();
  const { userPosition } = useRanking(userData?.id); // Keeping it as it is used in the notification dialog
  const [activeTab, setActiveTab] = useState<Tab>('tracker');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Progress calendar
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 3 + i);
    return {
      date,
      day: format(date, 'd'),
      weekday: format(date, 'EEE', { locale: ptBR }),
      isActive: isSameDay(date, selectedDay || new Date())
    };
  });

  const handleDayClick = (day: typeof weekDays[0]) => {
    setSelectedDay(day.date);
  };

  return (
    <div className="min-h-screen pb-28 bg-brand-sand-50/50">
      {/* Header - Modern Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-sand-200 shadow-sm">
        <div className="px-6 py-4">
          {/* Top Row: User & Notifications */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.id}`}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-brand-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                  Lvl 5
                </div>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-900 leading-tight">
                  {userData?.nome?.split(' ')[0] || 'Atleta'}
                </p>
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs font-medium">Pista Resenha</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-brand-blue-50 hover:text-brand-blue-600 transition-colors">
                <Users className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-brand-blue-50 hover:text-brand-blue-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-teal-500 border-2 border-white rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Navigation Pills - Clean & Modern */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            <button
              onClick={() => setActiveTab('tracker')}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
                activeTab === 'tracker'
                  ? "bg-brand-blue-600 text-white shadow-md shadow-brand-blue-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-brand-blue-300"
              )}
            >
              Tracker
            </button>
            <button
              onClick={() => onNavigate?.('jogos')}
              className="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-white text-slate-600 border border-slate-200 hover:border-brand-blue-300 hover:text-brand-blue-600 transition-all"
            >
              Jogos
            </button>
            <button
              onClick={() => setActiveTab('torneios')}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
                activeTab === 'torneios'
                  ? "bg-brand-teal-600 text-white shadow-md shadow-brand-teal-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-brand-teal-300"
              )}
            >
              Torneios
            </button>
            <button
              onClick={() => setActiveTab('profs')}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
                activeTab === 'profs'
                  ? "bg-brand-sand-600 text-white shadow-md shadow-brand-sand-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-brand-sand-300"
              )}
            >
              Aulas
            </button>
          </div>
        </div>

        {/* Date Strip - Minimalist */}
        <div className="px-6 pb-4 flex justify-between items-center gap-2 overflow-x-auto hide-scrollbar">
          {weekDays.map((day, i) => {
            const isActive = day.isActive;
            return (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[3.5rem] py-3 rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-brand-blue-600 text-white shadow-lg shadow-brand-blue-200 scale-105"
                    : "bg-transparent text-slate-400 hover:bg-slate-50"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">{day.weekday}</span>
                <span className="font-display text-xl font-bold leading-none">{day.day}</span>
                {isActive && <div className="w-1 h-1 bg-white rounded-full mt-1.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pt-6">
        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-1">Visão Geral</h2>
              <p className="text-sm text-slate-500">Acompanhe seu progresso hoje</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Main Stat Card - Level */}
              <div className="col-span-2 p-5 rounded-3xl bg-gradient-to-br from-brand-blue-600 to-brand-blue-800 text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>

                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div>
                    <p className="text-brand-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Nível Atual</p>
                    <h3 className="font-display text-3xl font-bold">Intermediário</h3>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/10">
                      <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                      <span className="text-xs font-semibold">Classe B</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-brand-blue-100">
                    <span>XP Recente</span>
                    <span>75% para Classe A</span>
                  </div>
                  <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-white rounded-full w-3/4 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  </div>
                </div>
              </div>

              {/* Stat Card 1 - Matches */}
              <div onClick={() => onNavigate?.('agenda')} className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-card transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Próximo Jogo</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-slate-900">Amanhã</span>
                </div>
                <p className="text-sm font-medium text-brand-blue-600 mt-1">15:00h</p>
              </div>

              {/* Stat Card 2 - Win Rate */}
              <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-card transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-teal-50 text-brand-teal-600 flex items-center justify-center mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Win Rate</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-slate-900">65</span>
                  <span className="text-sm font-bold text-slate-400">%</span>
                </div>
                <p className="text-xs font-medium text-slate-400 mt-1">13 Vitórias</p>
              </div>
            </div>

            {/* Quick Actions List */}
            <div>
              <h3 className="font-display text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Ações Rápidas</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate?.('agenda')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-blue-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-blue-50 text-brand-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="block font-display text-base font-bold text-slate-900">Agendar Partida</span>
                      <span className="text-xs text-slate-500 font-medium">Reserve sua quadra agora</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-blue-500 transition-colors" />
                </button>

                <button
                  onClick={() => onNavigate?.('jogos')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-teal-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-teal-50 text-brand-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className="block font-display text-base font-bold text-slate-900">Encontrar Parceiro</span>
                      <span className="text-xs text-slate-500 font-medium">Lobby com 3 jogadores</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-teal-500 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profs' && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900">Professores</h3>
              <button className="text-sm font-semibold text-brand-blue-600 hover:text-brand-blue-700">Ver todos</button>
            </div>

            <div className="space-y-4">
              {[
                {
                  nome: 'Prof. Ricardo Santos',
                  role: 'Alta Performance',
                  foto: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
                  rating: '4.9',
                  price: '100',
                  expertise: 'Futevôlei'
                },
                {
                  nome: 'Julia Becker',
                  role: 'Iniciantes & Kids',
                  foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
                  rating: '4.8',
                  price: '80',
                  expertise: 'Beach Tennis'
                }
              ].map((prof, i) => (
                <div key={i} className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft flex gap-4">
                  <img src={prof.foto} alt={prof.nome} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-display text-base font-bold text-slate-900">{prof.nome}</h4>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold text-slate-700">{prof.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-brand-blue-600 font-medium">{prof.expertise}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{prof.role}</p>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <span className="text-[10px] text-slate-400">/hora</span>
                        <p className="font-display text-lg font-bold text-slate-900">R$ {prof.price}</p>
                      </div>
                      <button className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                        Agendar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty States for other tabs */}
        {(activeTab === 'torneios' || activeTab === 'lobby') && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-brand-sand-100 flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-brand-sand-600 opacity-50" />
            </div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2">Em Breve</h3>
            <p className="text-sm text-slate-500 max-w-[200px]">Estamos preparando novidades incríveis para você.</p>
          </div>
        )}
      </div>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-sm rounded-3xl p-0 overflow-hidden bg-white/90 backdrop-blur-xl border-white/20">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="font-display text-xl font-bold text-slate-900">Notificações</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2 space-y-3">
            <div className="p-4 rounded-2xl bg-brand-teal-50/50 border border-brand-teal-100/50 flex gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-teal-500 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-900">Novo Challenge!</p>
                <p className="text-xs text-slate-500 mt-0.5">Carlos Silva quer jogar com você. <span className="text-brand-teal-600 font-semibold cursor-pointer">Ver convite</span></p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-brand-blue-50/50 border border-brand-blue-100/50 flex gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-blue-500 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-900">Ranking Atualizado</p>
                <p className="text-xs text-slate-500 mt-0.5">Parabéns! Você subiu para a posição #{userPosition || '-'}.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
