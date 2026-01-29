import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  Trophy,
  Users,
  Target,
  ChevronRight,
  Award,
  Activity,
  Bell,
  UserPlus,
  Calendar as CalendarIcon,
  Clock
} from 'lucide-react';
import { useRanking } from '@/hooks/useFirestore';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Tab = 'tracker' | 'lobby' | 'torneios' | 'profs';

export function HomeSection({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { userData } = useAuth();
  const { userPosition } = useRanking(userData?.id);
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
      weekday: format(date, 'EEE', { locale: ptBR }), // Abbreviated Portuguese names (Seg, Ter, etc.)
      isActive: isSameDay(date, selectedDay || new Date())
    };
  });

  const handleDayClick = (day: typeof weekDays[0]) => {
    setSelectedDay(day.date);
  };


  return (
    <div className="min-h-screen pb-24 bg-sand-50 dark:bg-sand-dark-50">
      {/* Beach Premium Header - Glassmorphism */}
      <div className="glass-beach px-6 py-4 sticky top-0 z-50 rounded-none md:rounded-3xl md:mx-6 md:mt-4 shadow-card">
        {/* Line 1: User Info + Badge + Notifications */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.id}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-white shadow-card"
            />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-black text-coral-500 dark:text-coral-dark uppercase tracking-tight px-2 py-0.5 bg-coral-500/10 dark:bg-coral-dark/10 rounded-xl">
                  CHALLENGER
                </span>
                <span className="text-[10px] text-sand-400 dark:text-sand-dark-400 font-bold">0</span>
              </div>
              <p className="text-sm font-black text-sand-900 dark:text-sand-dark-900 tracking-tight">{userData?.nome || 'Márcio Leonardo Coimbra'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl hover:bg-sand-100 dark:hover:bg-sand-dark-100 transition-colors">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-dark" />
            </button>
            <button
              onClick={() => setShowNotifications(true)}
              className="p-2.5 rounded-xl hover:bg-sand-100 dark:hover:bg-sand-dark-100 transition-colors relative">
              <Bell className="w-5 h-5 text-teal-600 dark:text-teal-dark" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 dark:bg-coral-dark rounded-full animate-pulse" />
            </button>
          </div>
        </div>

        {/* Line 2: Navigation Pills - Beach Premium */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-tight transition-all whitespace-nowrap ${activeTab === 'tracker'
              ? 'bg-teal-600 dark:bg-teal-dark text-white shadow-button-teal'
              : 'bg-sand-100 dark:bg-sand-dark-200 text-sand-900 dark:text-sand-dark-900'
              }`}
          >
            AGENDA
          </button>
          <button
            onClick={() => onNavigate?.('jogos')}
            className="px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-tight bg-coral-500 dark:bg-coral-dark text-white transition-all shadow-button-coral whitespace-nowrap"
          >
            JOGOS
          </button>
          <button
            onClick={() => setActiveTab('torneios')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-tight transition-all whitespace-nowrap ${activeTab === 'torneios'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600'
              }`}
          >
            TORNEIOS
          </button>
          <button
            onClick={() => setActiveTab('profs')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'profs'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600'
              }`}
          >
            AULAS
          </button>
        </div>

        {/* Line 3: Week Calendar */}
        <div className="flex justify-between items-end gap-1">
          {weekDays.map((day, i) => {
            const isActive = day.isActive;
            return (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                className={`flex-1 flex flex-col items-center justify-center transition-all relative ${isActive
                  ? 'bg-[#374151] text-white h-24 rounded-t-2xl rounded-b-[40%] scale-105 z-10 shadow-lg'
                  : 'text-gray-400 h-20 hover:text-gray-600'
                  }`}
              >
                {/* Red dot notification as seen in print */}
                {i === 4 && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F7F5F2] ring-1 ring-red-500/20" />
                )}

                <span className={`text-xl font-black leading-none ${isActive ? 'mb-2' : 'mb-1'}`}>
                  {day.day}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-tight ${isActive ? 'opacity-90' : 'opacity-40'}`}>
                  {day.weekday}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content */}
        {activeTab === 'tracker' && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-xl border border-gray-100">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-5"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80)' }}
            />
            <div className="relative p-6 space-y-5">
              <div>
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider">Resumo de Hoje</h3>
                <p className="text-xs text-gray-400 font-semibold">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-3xl bg-white border border-teal-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy className="w-12 h-12 text-teal-600" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.1em] mb-1">Nível do Atleta</p>
                    <div className="text-xl font-black text-gray-900 leading-tight">Intermediário</div>
                    <p className="text-xs font-bold text-teal-500 mb-3">CLASSE B</p>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-teal-50 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.4)]" style={{ width: '75%' }} />
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider text-right">75% para Classe A</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => onNavigate?.('agenda')}
                  className="p-4 rounded-3xl bg-white border border-coral-100 shadow-sm relative overflow-hidden group cursor-pointer hover:border-coral-200 transition-all"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CalendarIcon className="w-12 h-12 text-coral-500" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-coral-500 uppercase tracking-[0.1em] mb-1">Próxima Partida</p>
                    <div className="text-xl font-black text-gray-900 leading-tight">Amanhã</div>
                    <p className="text-xs font-bold text-coral-400 mb-3">15:00h</p>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-coral-50 rounded-lg w-fit">
                      <Users className="w-3 h-3 text-coral-500" />
                      <span className="text-[9px] font-black text-coral-600 uppercase">3 no Lobby</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-amber-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="w-12 h-12 text-amber-500" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.1em] mb-1">Performance</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">65</span>
                      <span className="text-sm font-black text-amber-500">%</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Win Rate Global</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-amber-50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '65%' }} />
                      </div>
                      <span className="text-[10px] font-black text-gray-900">13V</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Award className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Saldo Clube</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-gray-400">R$</span>
                      <span className="text-2xl font-black text-gray-900">150</span>
                    </div>
                    <p
                      onClick={() => onNavigate?.('perfil')}
                      className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-3 underline cursor-pointer"
                    >
                      Recarregar
                    </p>
                    <div className="flex items-center gap-1 opacity-60">
                      <Activity className="w-3 h-3 text-gray-400" />
                      <span className="text-[9px] font-black text-gray-400 uppercase">≈ 3 Partidas</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white border border-red-50 shadow-sm flex flex-col items-center justify-center group hover:border-red-100 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-lg font-black text-gray-900 leading-none">4</div>
                  <p className="text-[9px] font-black text-red-400 uppercase tracking-tighter">Streak</p>
                </div>
                <div
                  onClick={() => onNavigate?.('ranking')}
                  className="p-3 rounded-2xl bg-white border border-yellow-50 shadow-sm flex flex-col items-center justify-center group hover:border-yellow-100 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-lg font-black text-gray-900 leading-none">#12</div>
                  <p className="text-[9px] font-black text-yellow-500 uppercase tracking-tighter">Ranking</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-teal-50 shadow-sm flex flex-col items-center justify-center group hover:border-teal-100 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Award className="w-4 h-4 text-teal-500" />
                  </div>
                  <div className="text-lg font-black text-gray-900 leading-none">13</div>
                  <p className="text-[9px] font-black text-teal-500 uppercase tracking-tighter">Vitórias</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
                Professores Parceiros
              </h3>
              <button className="text-[10px] font-black text-teal-600 uppercase tracking-wider">Ver Todos</button>
            </div>

            {[
              {
                nome: 'Prof. Ricardo Santos',
                especialidade: 'Futevôlei - Alta Performance',
                foto: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
                rating: '4.9',
                aulas: '120',
                preco: '100'
              },
              {
                nome: 'Julia Becker',
                especialidade: 'Beach Tennis - Iniciante',
                foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
                rating: '4.8',
                aulas: '85',
                preco: '80'
              },
              {
                nome: 'Mestre Tico',
                especialidade: 'Vôlei de Praia - Fundamentos',
                foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                rating: '5.0',
                aulas: '210',
                preco: '120'
              }
            ].map((prof, i) => (
              <div key={i} className="bg-[#FAF8F5] rounded-3xl p-4 shadow-sm border border-[#E3D9C6]/30 flex items-center justify-between group hover:border-teal-200 transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={prof.foto}
                      alt={prof.nome}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 border-2 border-white rounded-full flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-gray-900 mb-0.5">{prof.nome}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{prof.especialidade}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-xs">⭐️</span>
                      <span className="text-xs font-black text-gray-700">{prof.rating}</span>
                      <span className="text-[10px] font-bold text-gray-400">({prof.aulas} aulas)</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">Por Hora</p>
                    <p className="text-lg font-black text-gray-900 leading-none">R$ {prof.preco}</p>
                  </div>
                  <button className="px-4 py-2 bg-teal-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-teal-500/30 group-hover:bg-teal-600 transition-colors">
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {(activeTab === 'lobby' || activeTab === 'torneios') && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Activity className="w-10 h-10 text-gray-300" />
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 uppercase">Em breve</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Estamos preparando novidades</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider px-1">
            Ações Rápidas
          </h3>

          <button
            onClick={() => onNavigate?.('agenda')}
            className="w-full rounded-3xl bg-white border border-gray-200 p-4 flex items-center justify-between hover:border-teal-400 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900">Agendar Partida</p>
                <p className="text-xs font-semibold text-gray-500">Reserve sua quadra</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={() => onNavigate?.('challenge')}
            className="w-full rounded-3xl bg-white border border-gray-200 p-4 flex items-center justify-between hover:border-purple-400 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-gray-900">Encontrar Parceiro</p>
                <p className="text-xs font-semibold text-gray-500">Challenge disponíveis</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="bg-white border-gray-200 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-black">Notificações</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
              <p className="text-sm font-bold text-gray-900 mb-1">Novo Challenge!</p>
              <p className="text-xs text-gray-600">Carlos Silva quer jogar com você</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <p className="text-sm font-bold text-gray-900 mb-1">Subiu no Ranking</p>
              <p className="text-xs text-gray-600">Você agora é {userPosition}º</p>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
              <p className="text-sm font-bold text-gray-900 mb-1">Quadra Confirmada</p>
              <p className="text-xs text-gray-600">Sua reserva está confirmada</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Day Detail Dialog */}
      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="bg-white border-gray-200 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-black">
              {selectedDay && format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <p className="text-xs font-bold text-gray-500 mb-1">Tempo Treinado</p>
              <p className="text-2xl font-black text-gray-900">48 min</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 mb-1">Jogos</p>
                <p className="text-lg font-black text-gray-900">2</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 mb-1">Vitórias</p>
                <p className="text-lg font-black text-teal-600">1</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
