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

  // Sorting duplas by score since Firestore might not have the correct ordering yet
  const sortedDuplas = [...(duplas || [])].sort((a, b) => b.pontuacao - a.pontuacao);

  const top3Individual = rankingIndividual.slice(0, 3);
  const restIndividual = rankingIndividual.slice(3);

  const top3Duplas = sortedDuplas.slice(0, 3);
  const restDuplas = sortedDuplas.slice(3);

  return (
    <div className="min-h-screen pb-24 bg-[#F7F5F2]">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">Ranking Oficial</h1>
          </div>
          {temporadaAtiva && (
            <div className="px-3 py-1 bg-teal-50 rounded-full border border-teal-100 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider">
                Temporada Ativa
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Tab Pills */}
        <div className="flex items-center gap-2 bg-white/50 p-1 rounded-full border border-gray-200/50 w-fit mx-auto shadow-sm">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'individual'
              ? 'bg-gray-900 text-white shadow-lg'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              Individual
            </div>
          </button>
          <button
            onClick={() => setActiveTab('duplas')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'duplas'
              ? 'bg-gray-900 text-white shadow-lg'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Duplas
            </div>
          </button>
        </div>

        {/* Podium Area */}
        <div className="relative pt-10 pb-6">
          <div className="flex items-end justify-center gap-2 px-2">
            {/* 2nd Place */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-3 group">
                <div className="absolute inset-0 bg-gray-300 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <img
                  src={activeTab === 'individual'
                    ? (top3Individual[1]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[1]?.id}`)
                    : `https://api.dicebear.com/7.x/shapes/svg?seed=${top3Duplas[1]?.id}`
                  }
                  alt="Silver"
                  className="relative w-16 h-16 rounded-full border-4 border-gray-300 object-cover shadow-md"
                />
                <div className="absolute -bottom-2 -right-1 w-7 h-7 bg-gray-100 rounded-full border-2 border-gray-300 flex items-center justify-center font-black text-xs text-gray-400">
                  2
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-900 uppercase truncate w-20 text-center">
                {activeTab === 'individual' ? top3Individual[1]?.nome : top3Duplas[1]?.nome}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Pts:</span>
                <span className="text-xs font-black text-gray-700">
                  {activeTab === 'individual' ? top3Individual[1]?.pontuacaoAtual : top3Duplas[1]?.pontuacao}
                </span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex-1 flex flex-col items-center -mt-8">
              <div className="relative mb-3 group h-24 w-24 flex items-center justify-center">
                <div className="absolute -top-6 animate-bounce">
                  <Crown className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 animate-pulse rounded-full" />
                <img
                  src={activeTab === 'individual'
                    ? (top3Individual[0]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[0]?.id}`)
                    : `https://api.dicebear.com/7.x/shapes/svg?seed=${top3Duplas[0]?.id}`
                  }
                  alt="Gold"
                  className="relative w-20 h-20 rounded-full border-4 border-yellow-400 object-cover shadow-xl z-10"
                />
                <div className="absolute -bottom-2 right-1 w-8 h-8 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center font-black text-sm text-yellow-900 z-20 shadow-lg">
                  1
                </div>
              </div>
              <p className="text-xs font-black text-gray-900 uppercase truncate w-24 text-center">
                {activeTab === 'individual' ? top3Individual[0]?.nome : top3Duplas[0]?.nome}
              </p>
              <div className="px-3 py-1 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center gap-1.5 mt-1">
                <Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                <span className="text-xs font-black text-yellow-700">
                  {activeTab === 'individual' ? top3Individual[0]?.pontuacaoAtual : top3Duplas[0]?.pontuacao}
                </span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-3 group">
                <div className="absolute inset-0 bg-amber-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                <img
                  src={activeTab === 'individual'
                    ? (top3Individual[2]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[2]?.id}`)
                    : `https://api.dicebear.com/7.x/shapes/svg?seed=${top3Duplas[2]?.id}`
                  }
                  alt="Bronze"
                  className="relative w-14 h-14 rounded-full border-4 border-amber-600 object-cover shadow-sm"
                />
                <div className="absolute -bottom-2 -right-1 w-6 h-6 bg-amber-50 rounded-full border-2 border-amber-600 flex items-center justify-center font-black text-[10px] text-amber-700">
                  3
                </div>
              </div>
              <p className="text-[10px] font-black text-gray-900 uppercase truncate w-16 text-center">
                {activeTab === 'individual' ? top3Individual[2]?.nome : top3Duplas[2]?.nome}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Pts:</span>
                <span className="text-xs font-black text-gray-700">
                  {activeTab === 'individual' ? top3Individual[2]?.pontuacaoAtual : top3Duplas[2]?.pontuacao}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Classification List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-gray-600 uppercase tracking-widest">
              Tabela de Classificação
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {activeTab === 'individual' ? rankingIndividual.length : sortedDuplas.length} Jogadores
            </span>
          </div>

          <div className="space-y-3">
            {activeTab === 'individual' ? (
              loadingIndividual ? (
                <div className="flex flex-col items-center py-20 gap-3 opacity-50">
                  <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-teal-600 uppercase">Atualizando Ranking...</span>
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
                  <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Consultando Duplas...</span>
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
