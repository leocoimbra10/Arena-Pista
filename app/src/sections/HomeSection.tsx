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
  Clock,
  Star
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
    <div className="min-h-screen pb-28 bg-slate-50">
      {/* Header - Claymorphism Energetic */}
      <div className="bg-white px-6 py-4 sticky top-0 z-50 shadow-clay-lg border-b-2 border-slate-100">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Pista Resenha Beach"
            className="h-16 object-contain"
          />
        </div>

        {/* Line 1: User Info + Badge + Notifications */}
        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-4">
            <img
              src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.id}`}
              alt="Avatar"
              className="w-14 h-14 rounded-full border-3 border-blue-500 shadow-blue"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-orange-600 uppercase tracking-tight px-3 py-1 bg-orange-100 rounded-2xl border-2 border-orange-500">
                  CHALLENGER
                </span>
                <span className="text-[10px] text-slate-500 font-bold">0</span>
              </div>
              <p className="font-condensed text-base font-bold text-slate-800 tracking-tight">{userData?.nome || 'Márcio Leonardo Coimbra'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer">
              <Users className="w-6 h-6 text-blue-600" />
            </button>
            <button
              onClick={() => setShowNotifications(true)}
              className="p-2.5 rounded-2xl hover:bg-blue-50 transition-colors relative cursor-pointer">
              <Bell className="w-6 h-6 text-blue-600" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse-soft border-2 border-white" />
            </button>
          </div>
        </div>

        {/* Line 2: Navigation Pills - Claymorphism Energy */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`font-condensed px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-tight transition-all whitespace-nowrap border-3 cursor-pointer ${activeTab === 'tracker'
              ? 'bg-blue-500 text-white border-blue-600 shadow-blue'
              : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
              }`}
          >
            AGENDA
          </button>
          <button
            onClick={() => onNavigate?.('jogos')}
            className="font-condensed px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-tight bg-orange-500 text-white border-3 border-orange-600 shadow-orange transition-all whitespace-nowrap cursor-pointer hover:bg-orange-600"
          >
            JOGOS
          </button>
          <button
            onClick={() => setActiveTab('torneios')}
            className={`font-condensed px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-tight transition-all whitespace-nowrap border-3 cursor-pointer ${activeTab === 'torneios'
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald'
              : 'bg-white text-slate-600 border-slate-300 hover:border-emerald-400'
              }`}
          >
            TORNEIOS
          </button>
          <button
            onClick={() => setActiveTab('profs')}
            className={`font-condensed px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-tight transition-all whitespace-nowrap border-3 cursor-pointer ${activeTab === 'profs'
              ? 'bg-slate-700 text-white border-slate-800 shadow-clay'
              : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
              }`}
          >
            AULAS
          </button>
        </div>

        {/* Line 3: Week Calendar - Energetic */}
        <div className="flex justify-between items-end gap-2">
          {weekDays.map((day, i) => {
            const isActive = day.isActive;
            return (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                className={`
                  flex-1 flex flex-col items-center justify-center 
                  transition-all duration-200 relative rounded-2xl
                  cursor-pointer
                  ${isActive
                    ? 'bg-blue-500 text-white h-24 border-l-4 border-blue-600 shadow-blue scale-105 z-10'
                    : 'text-slate-400 h-20 hover:text-slate-600 hover:bg-slate-100'
                  }
                `}
              >
                {/* Notification dot */}
                {i === 4 && (
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white shadow-orange" />
                )}

                <span className={`font-condensed text-2xl font-black leading-none ${isActive ? 'mb-2' : 'mb-1'}`}>
                  {day.day}
                </span>
                <span className={`font-condensed text-[10px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                  {day.weekday}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content */}
        {activeTab === 'tracker' && (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-condensed text-sm font-bold text-slate-700 uppercase tracking-wide mb-1">Resumo de Hoje</h3>
              <p className="text-xs text-slate-500 font-medium">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</p>
            </div>

            <div className="grid grid-cols-2  gap-4">
              {/* Nível do Atleta - Blue */}
              <div className="p-5 rounded-3xl bg-white border-l-4 border-blue-500 shadow-clay cursor-default lift-hover">
                <div className="flex items-start justify-between mb-3">
                  <Trophy className="w-16 h-16 text-blue-500" />
                </div>
                <p className="font-condensed text-[11px] font-bold text-blue-600 uppercase tracking-wide mb-1">Nível do Atleta</p>
                <div className="font-condensed text-2xl font-black text-slate-900 leading-tight mb-1">Intermediário</div>
                <p className="text-xs font-semibold text-blue-500 mb-4">CLASSE B</p>
                <div className="space-y-2">
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full shadow-blue transition-all duration-500" style={{ width: '75%' }} />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold text-right">75% para Classe A</p>
                </div>
              </div>

              {/* Próxima Partida - Orange */}
              <div
                onClick={() => onNavigate?.('agenda')}
                className="p-5 rounded-3xl bg-white border-l-4 border-orange-500 shadow-clay cursor-pointer lift-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <CalendarIcon className="w-16 h-16 text-orange-500" />
                </div>
                <p className="font-condensed text-[11px] font-bold text-orange-600 uppercase tracking-wide mb-1">Próxima Partida</p>
                <div className="font-condensed text-2xl font-black text-slate-900 leading-tight mb-1">Amanhã</div>
                <p className="text-xs font-semibold text-orange-500 mb-4">15:00h</p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-xl w-fit border border-orange-300">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span className="font-condensed text-xs font-bold text-orange-700 uppercase">3 no Lobby</span>
                </div>
              </div>

              {/* Performance - Emerald */}
              <div className="p-5 rounded-3xl bg-white border-l-4 border-emerald-500 shadow-clay cursor-default lift-hover">
                <div className="flex items-start justify-between mb-3">
                  <Target className="w-16 h-16 text-emerald-500" />
                </div>
                <p className="font-condensed text-[11px] font-bold text-emerald-600 uppercase tracking-wide mb-1">Performance</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-condensed text-4xl font-black text-slate-900">65</span>
                  <span className="text-lg font-black text-emerald-500">%</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase mb-3">Win Rate Global</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                  <span className="font-condensed text-xs font-black text-slate-900">13V</span>
                </div>
              </div>

              {/* Minhas Reservas - Purple with Highlight */}
              <div
                onClick={() => onNavigate?.('agenda')}
                className="p-5 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 border-l-4 border-purple-700 shadow-purple cursor-pointer lift-hover relative overflow-hidden"
              >
                {/* Highlight badge */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-400 rounded-lg">
                  <span className="text-[8px] font-black text-purple-900 uppercase">Novo</span>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <CalendarIcon className="w-16 h-16 text-white" />
                </div>
                <p className="font-condensed text-[11px] font-bold text-purple-100 uppercase tracking-wide mb-1">Minhas Reservas</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-condensed text-3xl font-black text-white">3</span>
                  <span className="text-sm font-black text-purple-100">ativas</span>
                </div>
                <p className="text-xs font-semibold text-purple-100 mb-3">
                  Ver histórico completo
                </p>
                <div className="flex items-center gap-2 text-purple-100">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">Próxima: Hoje 15h</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {/* Streak */}
              <div className="p-4 rounded-2xl bg-white border-3 border-red-500 shadow-clay flex flex-col items-center justify-center lift-hover cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="font-condensed text-2xl font-black text-slate-900 leading-none mb-1">4</div>
                <p className="font-condensed text-[10px] font-bold text-red-500 uppercase">Streak</p>
              </div>

              {/* Ranking */}
              <div
                onClick={() => onNavigate?.('ranking')}
                className="p-4 rounded-2xl bg-white border-3 border-yellow-500 shadow-clay flex flex-col items-center justify-center lift-hover cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="font-condensed text-2xl font-black text-slate-900 leading-none mb-1">#12</div>
                <p className="font-condensed text-[10px] font-bold text-yellow-600 uppercase">Ranking</p>
              </div>

              {/* Vitórias */}
              <div className="p-4 rounded-2xl bg-white border-3 border-emerald-500 shadow-clay flex flex-col items-center justify-center lift-hover cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="font-condensed text-2xl font-black text-slate-900 leading-none mb-1">13</div>
                <p className="font-condensed text-[10px] font-bold text-emerald-600 uppercase">Vitórias</p>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="mt-6 grid grid-cols-1 gap-4">
              {/* Agendar Partida */}
              <div
                onClick={() => onNavigate?.('agenda')}
                className="p-5 rounded-3xl bg-white border-l-4 border-emerald-600 shadow-clay cursor-pointer lift-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                      <CalendarIcon className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-condensed text-lg font-bold text-slate-900 mb-1">Agendar Partida</p>
                      <p className="text-xs text-slate-500 font-medium">Encontre horários disponíveis</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

              {/* Encontrar Parceiro */}
              <div
                onClick={() => onNavigate?.('jogos')}
                className="p-5 rounded-3xl bg-white border-l-4 border-orange-600 shadow-clay cursor-pointer lift-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                      <UserPlus className="w-7 h-7 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-condensed text-lg font-bold text-slate-900 mb-1">Encontrar Parceiro</p>
                      <p className="text-xs text-slate-500 font-medium">Conecte-se com outros jogadores</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profs' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between px-1 mb-4">
              <h3 className="font-condensed text-base font-bold text-slate-800 uppercase tracking-wide">
                Professores Parceiros
              </h3>
              <button className="font-condensed text-xs font-bold text-blue-600 uppercase tracking-wide hover:text-blue-700 transition-colors">Ver Todos</button>
            </div>

            {[
              {
                nome: 'Prof. Ricardo Santos',
                especialidade: 'Futevôlei - Alta Performance',
                foto: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
                rating: '4.9',
                aulas: '120',
                preco: '100',
                borderColor: 'blue'
              },
              {
                nome: 'Julia Becker',
                especialidade: 'Beach Tennis - Iniciante',
                foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
                rating: '4.8',
                aulas: '85',
                preco: '80',
                borderColor: 'emerald'
              },
              {
                nome: 'Mestre Tico',
                especialidade: 'Vôlei de Praia - Fundamentos',
                foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                rating: '5.0',
                aulas: '210',
                preco: '120',
                borderColor: 'orange'
              }
            ].map((prof, i) => {
              const borderColors = {
                blue: 'border-blue-500',
                emerald: 'border-emerald-500',
                orange: 'border-orange-500'
              };
              const bgColors = {
                blue: 'bg-blue-50',
                emerald: 'bg-emerald-50',
                orange: 'bg-orange-50'
              };
              const textColors = {
                blue: 'text-blue-600',
                emerald: 'text-emerald-600',
                orange: 'text-orange-600'
              };

              return (
                <div
                  key={i}
                  className={`p-5 rounded-3xl bg-white ${borderColors[prof.borderColor as keyof typeof borderColors]} border-l-4 shadow-clay lift-hover cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={prof.foto}
                          alt={prof.nome}
                          className={`w-20 h-20 rounded-full object-cover border-3 ${borderColors[prof.borderColor as keyof typeof borderColors]}`}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-8 h-8 ${bgColors[prof.borderColor as keyof typeof bgColors]} border-2 border-white rounded-full flex items-center justify-center shadow-clay`}>
                          <Clock className={`w-4 h-4 ${textColors[prof.borderColor as keyof typeof textColors]}`} />
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-condensed text-base font-bold text-slate-900 mb-1">{prof.nome}</p>
                        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-tight mb-2">{prof.especialidade}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className={`w-4 h-4 ${textColors[prof.borderColor as keyof typeof textColors]} fill-current`} />
                            <span className="text-sm font-black text-slate-800">{prof.rating}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500">({prof.aulas} aulas)</span>
                        </div>
                      </div>
                    </div>

                    {/* Preço + CTA */}
                    <div className="text-right flex flex-col items-end gap-3">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase leading-none mb-1">Por Hora</p>
                        <p className="font-condensed text-2xl font-black text-slate-900 leading-none">R$ {prof.preco}</p>
                      </div>
                      <button className={`px-5 py-2.5 ${bgColors[prof.borderColor as keyof typeof bgColors]} ${textColors[prof.borderColor as keyof typeof textColors]} rounded-2xl font-condensed text-xs font-bold uppercase tracking-wide border-2 ${borderColors[prof.borderColor as keyof typeof borderColors]} shadow-clay transition-all hover:scale-105`}>
                        Agendar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
            onClick={() => onNavigate?.('jogos')}
            className="w-full rounded-3xl bg-white border border-gray-200 p-4 flex items-center justify-between hover:border-coral-400 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-coral-100 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-coral-600" />
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
    </div >
  );
}
