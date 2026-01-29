import { useState } from 'react';
import { useRanking, useCollection } from '@/hooks/useFirestore';
import { Trophy, Crown, Users, User, Star } from 'lucide-react';
import type { Dupla, Temporada } from '@/types';
import { RankingCard } from '@/components/RankingCard';

type TabType = 'individual' | 'duplas';

export function RankingSection() {
  const [activeTab, setActiveTab] = useState<TabType>('individual');
  const { ranking: rankingIndividual, loading: loadingIndividual } = useRanking();
  const { data: duplas, loading: loadingDuplas } = useCollection<Dupla>('duplas');
  const { data: temporadas } = useCollection<Temporada>('temporadas');

  const temporadaAtiva = temporadas?.find((t) => t.ativa);
  const sortedDuplas = [...(duplas || [])].sort((a, b) => b.pontuacao - a.pontuacao);

  const top3Individual = rankingIndividual.slice(0, 3);
  const restIndividual = rankingIndividual.slice(3);
  const top3Duplas = sortedDuplas.slice(0, 3);
  const restDuplas = sortedDuplas.slice(3);

  return (
    <div className="min-h-screen pb-24 bg-sand-50 dark:bg-sand-dark-50">
      {/* Beach Premium Header */}
      <div className="bg-white dark:bg-sand-dark-100 border-b border-sand-200 dark:border-sand-dark-200 px-6 py-4 sticky top-0 z-20 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-coral-500 dark:text-coral-dark" />
            <h1 className="text-lg font-black text-sand-900 dark:text-sand-dark-900 uppercase tracking-tight">RANKING OFICIAL</h1>
          </div>
          {temporadaAtiva && (
            <div className="px-3 py-1 bg-teal-600/10 dark:bg-teal-dark/10 rounded-full border border-teal-600/20 dark:border-teal-dark/20 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-teal-600 dark:bg-teal-dark rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-teal-600 dark:text-teal-dark uppercase tracking-wide">
                Temporada Ativa
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tab Pills - Beach Premium */}
        <div className="flex items-center gap-2 bg-white/50 dark:bg-sand-dark-100/50 p-1 rounded-full border border-sand-200 dark:border-sand-dark-200 w-fit mx-auto shadow-card">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tight transition-all ${activeTab === 'individual'
              ? 'bg-teal-600 dark:bg-teal-dark text-white shadow-button-teal'
              : 'text-sand-400 dark:text-sand-dark-400 hover:text-sand-900 dark:hover:text-sand-dark-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Individual
            </div>
          </button>
          <button
            onClick={() => setActiveTab('duplas')}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tight transition-all ${activeTab === 'duplas'
              ? 'bg-coral-500 dark:bg-coral-dark text-white shadow-button-coral'
              : 'text-sand-400 dark:text-sand-dark-400 hover:text-sand-900 dark:hover:text-sand-dark-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Duplas
            </div>
          </button>
        </div>

        {/* Podium Area - Beach Premium Gold/Silver/Bronze */}
        <div className="relative pt-10 pb-6">
          <div className="flex items-end justify-center gap-2 px-2">
            {/* 2nd Place - Silver */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-3 group">
                <div className="absolute inset-0 bg-sand-400 dark:bg-sand-dark-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <img
                  src={activeTab === 'individual'
                    ? (top3Individual[1]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[1]?.id}`)
                    : `https://api.dicebear.com/7.x/shapes/svg?seed=${top3Duplas[1]?.id}`
                  }
                  alt="Silver"
                  className="relative w-16 h-16 rounded-full border-4 border-sand-400 dark:border-sand-dark-400 object-cover shadow-md"
                />
                <div className="absolute -bottom-2 -right-1 w-7 h-7 bg-white dark:bg-sand-dark-100 rounded-full border-2 border-sand-400 dark:border-sand-dark-400 flex items-center justify-center font-black text-xs text-sand-900 dark:text-sand-dark-900">
                  2
                </div>
              </div>
              <p className="text-[10px] font-black text-sand-900 dark:text-sand-dark-900 uppercase truncate w-20 text-center">
                {activeTab === 'individual' ? top3Individual[1]?.nome : top3Duplas[1]?.nome}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-bold text-sand-400 dark:text-sand-dark-400 uppercase">Pts:</span>
                <span className="text-xs font-black text-sand-900 dark:text-sand-dark-900">
                  {activeTab === 'individual' ? top3Individual[1]?.pontuacaoAtual : top3Duplas[1]?.pontuacao}
                </span>
              </div>
            </div>

            {/* 1st Place - Gold */}
            <div className="flex-1 flex flex-col items-center -mt-8">
              <div className="relative mb-3 group h-24 w-24 flex items-center justify-center">
                <div className="absolute -top-6 animate-bounce">
                  <Crown className="w-8 h-8 text-coral-500 dark:text-coral-dark fill-coral-500 dark:fill-coral-dark" />
                </div>
                <div className="absolute inset-0 bg-coral-500 dark:bg-coral-dark blur-xl opacity-30 animate-pulse rounded-full" />
                <img
                  src={activeTab === 'individual'
                    ? (top3Individual[0]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[0]?.id}`)
                    : `https://api.dicebear.com/7.x/shapes/svg?seed=${top3Duplas[0]?.id}`
                  }
                  alt="Gold"
                  className="relative w-20 h-20 rounded-full border-4 border-coral-500 dark:border-coral-dark object-cover shadow-xl z-10"
                />
                <div className="absolute -bottom-2 right-1 w-8 h-8 bg-coral-500 dark:bg-coral-dark rounded-full border-2 border-white dark:border-sand-dark-100 flex items-center justify-center font-black text-sm text-white z-20 shadow-lg">
                  1
                </div>
              </div>
              <p className="text-xs font-black text-sand-900 dark:text-sand-dark-900 uppercase truncate w-24 text-center">
                {activeTab === 'individual' ? top3Individual[0]?.nome : top3Duplas[0]?.nome}
              </p>
              <div className="px-3 py-1 bg-coral-500/10 dark:bg-coral-dark/10 border border-coral-500/20 dark:border-coral-dark/20 rounded-xl flex items-center gap-1.5 mt-1">
                <Star className="w-3 h-3 text-coral-500 dark:text-coral-dark fill-coral-500 dark:fill-coral-dark" />
                <span className="text-xs font-black text-coral-500 dark:text-coral-dark">
                  {activeTab === 'individual' ? top3Individual[0]?.pontuacaoAtual : top3Duplas[0]?.pontuacao}
                </span>
              </div>
            </div>

            {/* 3rd Place - Bronze (Teal) */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-3 group">
                <div className="absolute inset-0 bg-teal-600 dark:bg-teal-dark blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <img
                  src={activeTab === 'individual'
                    ? (top3Individual[2]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[2]?.id}`)
                    : `https://api.dicebear.com/7.x/shapes/svg?seed=${top3Duplas[2]?.id}`
                  }
                  alt="Bronze"
                  className="relative w-14 h-14 rounded-full border-4 border-teal-600 dark:border-teal-dark object-cover shadow-sm"
                />
                <div className="absolute -bottom-2 -right-1 w-6 h-6 bg-white dark:bg-sand-dark-100 rounded-full border-2 border-teal-600 dark:border-teal-dark flex items-center justify-center font-black text-[10px] text-teal-600 dark:text-teal-dark">
                  3
                </div>
              </div>
              <p className="text-[10px] font-black text-sand-900 dark:text-sand-dark-900 uppercase truncate w-16 text-center">
                {activeTab === 'individual' ? top3Individual[2]?.nome : top3Duplas[2]?.nome}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-bold text-sand-400 dark:text-sand-dark-400 uppercase">Pts:</span>
                <span className="text-xs font-black text-sand-900 dark:text-sand-dark-900">
                  {activeTab === 'individual' ? top3Individual[2]?.pontuacaoAtual : top3Duplas[2]?.pontuacao}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Classification List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-sand-900 dark:text-sand-dark-900 uppercase tracking-wide">
              Tabela de Classificação
            </h3>
            <span className="text-[10px] font-bold text-sand-400 dark:text-sand-dark-400 uppercase">
              {activeTab === 'individual' ? rankingIndividual.length : sortedDuplas.length} Jogadores
            </span>
          </div>

          <div className="space-y-3">
            {activeTab === 'individual' ? (
              loadingIndividual ? (
                <div className="flex flex-col items-center py-20 gap-3 opacity-50">
                  <div className="w-10 h-10 border-4 border-teal-600 dark:border-teal-dark border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-teal-600 dark:text-teal-dark uppercase">Atualizando Ranking...</span>
                </div>
              ) : (
                restIndividual.map((player, index) => (
                  <RankingCard
                    key={player.id}
                    position={index + 4}
                    item={player}
                    type="individual"
                  />
                ))
              )
            ) : (
              loadingDuplas ? (
                <div className="flex flex-col items-center py-20 gap-3 opacity-50">
                  <div className="w-10 h-10 border-4 border-coral-500 dark:border-coral-dark border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-coral-500 dark:text-coral-dark uppercase tracking-wide">Consultando Duplas...</span>
                </div>
              ) : (
                restDuplas.map((dupla, index) => (
                  <RankingCard
                    key={dupla.id}
                    position={index + 4}
                    item={dupla}
                    type="dupla"
                  />
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
