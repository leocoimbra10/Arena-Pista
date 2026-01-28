import { useState } from 'react';
import { Header } from '@/components/Header';
import { RankingCard } from '@/components/RankingCard';
import { useRanking, useCollection } from '@/hooks/useFirestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Crown, Users, User } from 'lucide-react';
import type { Dupla, Temporada } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RankingSection() {
  const [activeTab, setActiveTab] = useState<'individual' | 'duplas'>('individual');
  const { ranking: rankingIndividual, loading: loadingIndividual } = useRanking();
  const { data: duplas, loading: loadingDuplas } = useCollection<Dupla>('duplas', []);
  const { data: temporadas } = useCollection<Temporada>('temporadas', []);

  const temporadaAtiva = temporadas?.find((t) => t.ativa);

  const top3Individual = rankingIndividual.slice(0, 3);
  const restIndividual = rankingIndividual.slice(3);

  const top3Duplas = duplas?.slice(0, 3) || [];
  const restDuplas = duplas?.slice(3) || [];

  return (
    <div className="min-h-screen pb-20 bg-[#0f0f1a]">
      <Header title="Ranking" />
      
      <div className="p-4 space-y-4">
        {/* Season Info */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f472b6]/20 to-[#ec4899]/10 border border-[#f472b6]/20 p-5">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-[#f472b6]" />
              <span className="text-sm text-[#f472b6] font-medium">
                {temporadaAtiva ? 'Temporada Ativa' : 'Sem temporada ativa'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {temporadaAtiva?.nome || 'Aguardando nova temporada'}
            </h2>
            {temporadaAtiva && (
              <p className="text-sm text-gray-400 mt-1">
                Até {format(new Date(temporadaAtiva.dataFim), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            )}
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f472b6]/10 rounded-full blur-3xl" />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'individual' | 'duplas')}>
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger 
              value="individual" 
              className="data-[state=active]:bg-[#a3e635] data-[state=active]:text-black"
            >
              <User className="w-4 h-4 mr-2" />
              Individual
            </TabsTrigger>
            <TabsTrigger 
              value="duplas"
              className="data-[state=active]:bg-[#a3e635] data-[state=active]:text-black"
            >
              <Users className="w-4 h-4 mr-2" />
              Duplas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="mt-4 space-y-4">
            {/* Podium */}
            {top3Individual.length > 0 && (
              <div className="relative">
                <div className="flex items-end justify-center gap-4 py-6">
                  {/* 2nd Place */}
                  {top3Individual[1] && (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gray-300 mb-2">
                        <img 
                          src={top3Individual[1].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[1].id}`}
                          alt={top3Individual[1].nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-12 h-20 bg-gray-300/20 rounded-t-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-300">2</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-[80px]">{top3Individual[1].nome}</p>
                      <p className="text-sm font-bold text-[#a3e635]">{top3Individual[1].pontuacaoAtual}</p>
                    </div>
                  )}

                  {/* 1st Place */}
                  {top3Individual[0] && (
                    <div className="flex flex-col items-center -mt-4">
                      <Crown className="w-6 h-6 text-yellow-400 mb-1" />
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400 mb-2">
                        <img 
                          src={top3Individual[0].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[0].id}`}
                          alt={top3Individual[0].nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-16 h-28 bg-yellow-400/20 rounded-t-lg flex items-center justify-center">
                        <span className="text-3xl font-bold text-yellow-400">1</span>
                      </div>
                      <p className="text-sm text-white font-medium mt-1 truncate max-w-[100px]">{top3Individual[0].nome}</p>
                      <p className="text-lg font-bold text-[#a3e635]">{top3Individual[0].pontuacaoAtual}</p>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {top3Individual[2] && (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-amber-600 mb-2">
                        <img 
                          src={top3Individual[2].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${top3Individual[2].id}`}
                          alt={top3Individual[2].nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-12 h-16 bg-amber-600/20 rounded-t-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-amber-600">3</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-[80px]">{top3Individual[2].nome}</p>
                      <p className="text-sm font-bold text-[#a3e635]">{top3Individual[2].pontuacaoAtual}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rest of Ranking */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Classificação</h3>
              {loadingIndividual ? (
                <div className="text-center py-8 text-gray-500">Carregando...</div>
              ) : (
                <div className="space-y-2">
                  {restIndividual.map((player, index) => (
                    <RankingCard 
                      key={player.id}
                      position={index + 4}
                      item={player}
                      type="individual"
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="duplas" className="mt-4 space-y-4">
            {/* Duplas Podium */}
            {top3Duplas.length > 0 && (
              <div className="relative">
                <div className="flex items-end justify-center gap-4 py-6">
                  {/* 2nd Place */}
                  {top3Duplas[1] && (
                    <div className="flex flex-col items-center">
                      <div className="flex -space-x-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-black font-bold text-sm border-2 border-[#1a1a2e]">
                          {top3Duplas[1].nome.charAt(0)}
                        </div>
                      </div>
                      <div className="w-12 h-16 bg-gray-300/20 rounded-t-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-300">2</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-[80px]">{top3Duplas[1].nome}</p>
                      <p className="text-sm font-bold text-[#a3e635]">{top3Duplas[1].pontuacao}</p>
                    </div>
                  )}

                  {/* 1st Place */}
                  {top3Duplas[0] && (
                    <div className="flex flex-col items-center -mt-4">
                      <Crown className="w-6 h-6 text-yellow-400 mb-1" />
                      <div className="flex -space-x-2 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-black font-bold border-2 border-[#1a1a2e]">
                          {top3Duplas[0].nome.charAt(0)}
                        </div>
                      </div>
                      <div className="w-16 h-24 bg-yellow-400/20 rounded-t-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-yellow-400">1</span>
                      </div>
                      <p className="text-sm text-white font-medium mt-1 truncate max-w-[100px]">{top3Duplas[0].nome}</p>
                      <p className="text-lg font-bold text-[#a3e635]">{top3Duplas[0].pontuacao}</p>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {top3Duplas[2] && (
                    <div className="flex flex-col items-center">
                      <div className="flex -space-x-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm border-2 border-[#1a1a2e]">
                          {top3Duplas[2].nome.charAt(0)}
                        </div>
                      </div>
                      <div className="w-12 h-14 bg-amber-600/20 rounded-t-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-amber-600">3</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate max-w-[80px]">{top3Duplas[2].nome}</p>
                      <p className="text-sm font-bold text-[#a3e635]">{top3Duplas[2].pontuacao}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rest of Duplas Ranking */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Classificação de Duplas</h3>
              {loadingDuplas ? (
                <div className="text-center py-8 text-gray-500">Carregando...</div>
              ) : duplas?.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhuma dupla cadastrada</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {restDuplas.map((dupla, index) => (
                    <RankingCard 
                      key={dupla.id}
                      position={index + 4}
                      item={dupla}
                      type="dupla"
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
