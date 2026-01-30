import { useState } from 'react';
import { useRanking, useCollection } from '@/hooks/useFirestore';
import { Trophy, Crown, Users, User } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import type { Dupla } from '@/types';
import { RankingCard } from '@/components/RankingCard';

type TabType = 'individual' | 'duplas';

export function RankingSection() {
  const [activeTab, setActiveTab] = useState<TabType>('individual');
  const { ranking: rankingIndividual, loading: loadingIndividual } = useRanking();
  const { data: duplas, loading: loadingDuplas } = useCollection<Dupla>('duplas');



  const sortedDuplas = [...(duplas || [])].sort((a, b) => b.pontuacao - a.pontuacao);

  const isLoading = activeTab === 'individual' ? loadingIndividual : loadingDuplas;
  const isEmpty = activeTab === 'individual' ? rankingIndividual.length === 0 : sortedDuplas.length === 0;
  const currentList = activeTab === 'individual' ? rankingIndividual : sortedDuplas;

  const top3Individual = rankingIndividual.slice(0, 3);
  const restIndividual = rankingIndividual.slice(3);
  const top3Duplas = sortedDuplas.slice(0, 3);
  const restDuplas = sortedDuplas.slice(3);

  return (
    <div className="min-h-screen pb-24 bg-sand-50 dark:bg-sand-dark-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-100 px-6 py-4 sticky top-0 z-20 shadow-clay-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-coral-100 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-coral-600" />
          </div>
          <div>
            <h1 className="font-condensed text-xl font-black text-slate-900 uppercase tracking-tight">Ranking Oficial</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-semibold text-emerald-600 uppercase">Temporada Ativa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Tab Pills */}
        <div className="flex items-center gap-3 p-1.5 bg-white rounded-2xl border-2 border-slate-100 shadow-sm w-full">
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex-1 py-3 rounded-xl font-condensed text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'individual'
              ? 'bg-blue-500 text-white shadow-blue lift-hover'
              : 'text-slate-400 hover:bg-slate-50'
              }`}
          >
            <User className="w-4 h-4" />
            Individual
          </button>
          <button
            onClick={() => setActiveTab('duplas')}
            className={`flex-1 py-3 rounded-xl font-condensed text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeTab === 'duplas'
              ? 'bg-orange-500 text-white shadow-orange lift-hover'
              : 'text-slate-400 hover:bg-slate-50'
              }`}
          >
            <Users className="w-4 h-4" />
            Duplas
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 animate-in fade-in zoom-in duration-500">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-coral-500 rounded-full animate-spin shadow-lg" />
            <span className="font-condensed text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">
              Carregando Ranking...
            </span>
          </div>
        ) : isEmpty ? (
          <EmptyState
            icon={Trophy}
            title="Ranking Vazio"
            description="Ainda não há pontuações registradas para esta categoria na temporada atual."
            color="coral"
          />
        ) : (
          <>
            {/* Podium Area */}
            <div className="relative pt-8 pb-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-end justify-center gap-4 px-2">
                {/* 2nd Place - Silver (Blueish) */}
                <div className="flex-1 flex flex-col items-center z-10">
                  <div className="relative mb-3 group">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-300 shadow-lg bg-slate-100">
                      <img
                        src={activeTab === 'individual'
                          ? (top3Individual[1]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[1]?.id || '2'}`)
                          : `https://api.dicebear.com/7.x/shapes/svg?seed=${top3Duplas[1]?.id || '2'}`
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-200 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <span className="font-condensed text-sm font-black text-slate-600">2</span>
                    </div>
                  </div>
                  <p className="font-condensed text-sm font-bold text-slate-900 uppercase truncate w-24 text-center mt-2">
                    {activeTab === 'individual' ? top3Individual[1]?.nome : top3Duplas[1]?.nome || 'TBD'}
                  </p>
                  <div className="px-3 py-1 bg-slate-100 rounded-lg mt-1 border border-slate-200">
                    <span className="font-condensed text-xs font-black text-slate-600">
                      {activeTab === 'individual' ? top3Individual[1]?.pontuacaoAtual : top3Duplas[1]?.pontuacao || 0} pts
                    </span>
                  </div>
                </div>

                {/* 1st Place - Gold (Yellow/Amber) */}
                <div className="flex-1 flex flex-col items-center -mt-12 z-20 scale-110">
                  <div className="relative mb-3 group">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
                      <Crown className="w-10 h-10 text-amber-500 fill-amber-500 drop-shadow-lg" />
                    </div>
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-500 shadow-xl bg-amber-100 ring-4 ring-amber-100">
                      <img
                        src={activeTab === 'individual'
                          ? (top3Individual[0]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[0]?.id || '1'}`)
                          : `https://api.dicebear.com/7.x/shapes/svg?seed=${top3Duplas[0]?.id || '1'}`
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-500 rounded-full border-4 border-white flex items-center justify-center shadow-amber">
                      <span className="font-condensed text-lg font-black text-white">1</span>
                    </div>
                  </div>
                  <p className="font-condensed text-base font-black text-slate-900 uppercase truncate w-28 text-center mt-4">
                    {activeTab === 'individual' ? top3Individual[0]?.nome : top3Duplas[0]?.nome || 'TBD'}
                  </p>
                  <div className="px-4 py-1.5 bg-amber-100 rounded-xl mt-1 border-2 border-amber-200">
                    <span className="font-condensed text-sm font-black text-amber-700">
                      {activeTab === 'individual' ? top3Individual[0]?.pontuacaoAtual : top3Duplas[0]?.pontuacao || 0} pts
                    </span>
                  </div>
                </div>

                {/* 3rd Place - Bronze (Orange/Brown) */}
                <div className="flex-1 flex flex-col items-center z-10">
                  <div className="relative mb-3 group">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-400 shadow-lg bg-orange-50">
                      <img
                        src={activeTab === 'individual'
                          ? (top3Individual[2]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[2]?.id || '3'}`)
                          : `https://api.dicebear.com/7.x/shapes/svg?seed=${top3Duplas[2]?.id || '3'}`
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-400 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <span className="font-condensed text-sm font-black text-white">3</span>
                    </div>
                  </div>
                  <p className="font-condensed text-sm font-bold text-slate-900 uppercase truncate w-24 text-center mt-2">
                    {activeTab === 'individual' ? top3Individual[2]?.nome : top3Duplas[2]?.nome || 'TBD'}
                  </p>
                  <div className="px-3 py-1 bg-orange-50 rounded-lg mt-1 border border-orange-200">
                    <span className="font-condensed text-xs font-black text-orange-700">
                      {activeTab === 'individual' ? top3Individual[2]?.pontuacaoAtual : top3Duplas[2]?.pontuacao || 0} pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification List */}
            <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-100">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-sand-900 dark:text-sand-dark-900 uppercase tracking-wide">
                  Tabela de Classificação
                </h3>
                <span className="text-[10px] font-bold text-sand-400 dark:text-sand-dark-400 uppercase">
                  {currentList.length} Jogadores
                </span>
              </div>

              <div className="space-y-3">
                {activeTab === 'individual' ? (
                  restIndividual.map((player, index) => (
                    <RankingCard
                      key={player.id}
                      position={index + 4}
                      item={player}
                      type="individual"
                    />
                  ))
                ) : (
                  restDuplas.map((dupla, index) => (
                    <RankingCard
                      key={dupla.id}
                      position={index + 4}
                      item={dupla}
                      type="dupla"
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
