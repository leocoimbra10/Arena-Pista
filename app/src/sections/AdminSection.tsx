import { useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { useCollection, useQuadras, useAgendamentos } from '@/hooks/useFirestore';
import { format, isSameDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Usuario, Pagamento, Quadra, Professor } from '@/types';
import {
    Users,
    Palmtree,
    AlertCircle,
    DollarSign,
    Plus,
    Edit,
    Clock,
    Search,
    ShieldCheck,
    GraduationCap,
    Phone,
    Calendar
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAuth } from '@/contexts/AuthContext';

export function AdminSection() {
    const { userData } = useAuth();
    const [activeTab, setActiveTab] = useState<'financeiro' | 'quadras' | 'usuarios' | 'professores'>('financeiro');
    const { data: usuarios, update: updateUsuario } = useCollection<Usuario>('users');
    const { quadras, addQuadra, updateQuadra } = useQuadras();
    const [showQuadraDialog, setShowQuadraDialog] = useState(false);
    const [showUserEditDialog, setShowUserEditDialog] = useState(false);
    const [showChargeDialog, setShowChargeDialog] = useState(false);
    const [showProfessorDialog, setShowProfessorDialog] = useState(false);
    const [showTeacherAgenda, setShowTeacherAgenda] = useState(false);
    const [selectedProfessorForAgenda, setSelectedProfessorForAgenda] = useState<Professor | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedQuadra, setSelectedQuadra] = useState<Partial<Quadra> | null>(null);
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
    const [selectedProfessor, setSelectedProfessor] = useState<Partial<Professor> | null>(null);

    const { data: pagamentos, update: updatePagamento, add: addPagamento } = useCollection<Pagamento>('pagamentos');
    const { data: professores, update: updateProfessor, add: addProfessor } = useCollection<Professor>('professores');
    const dateStrip = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
    const { agendamentos } = useAgendamentos(selectedDate);
    const teacherAgendamentos = agendamentos?.filter(a => a.professorId === selectedProfessorForAgenda?.id);

    const [searchTerm, setSearchTerm] = useState('');

    // SECURITY: Only allow admin users
    if (userData?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-sand-50 dark:bg-sand-dark-50 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-sand-dark-100 rounded-3xl shadow-card p-8 max-w-md text-center">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-coral-500 dark:text-coral-dark" />
                    <h2 className="text-2xl font-black text-sand-900 dark:text-sand-dark-900 mb-2">Acesso Restrito</h2>
                    <p className="text-sm text-sand-400 dark:text-sand-dark-400 mb-6">
                        Esta área é exclusiva para administradores da arena. Se você precisa de acesso administrativo, entre em contato com o gestor da arena.
                    </p>
                    <div className="bg-sand-100 dark:bg-sand-dark-200 rounded-2xl p-4">
                        <p className="text-xs font-bold text-sand-900 dark:text-sand-dark-900 uppercase tracking-tight">
                            Seu perfil atual: {userData?.role || 'player'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const filteredUsuarios = usuarios?.filter(u =>
        u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleConfirmPayment = async (pagamentoId: string) => {
        try {
            await updatePagamento(pagamentoId, {
                status: 'pago',
                dataPagamento: new Date()
            });
            toast.success('Pagamento confirmado com sucesso!');
        } catch (error) {
            toast.error('Erro ao confirmar pagamento');
        }
    };

    const handleToggleMensalista = async (usuario: Usuario) => {
        try {
            const isMensalista = usuario.financeiro?.mensalista || false;
            await updateUsuario(usuario.id, {
                financeiro: {
                    ...usuario.financeiro,
                    mensalista: !isMensalista,
                    statusMensalidade: !isMensalista ? 'em_dia' : 'pendente'
                }
            } as any);
            toast.success(`Usuário agora é ${!isMensalista ? 'mensalista' : 'avulso'}`);
        } catch (error) {
            toast.error('Erro ao atualizar status do usuário');
        }
    };

    const handleSaveQuadra = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const quadraData = {
            nome: formData.get('nome') as string,
            descricao: formData.get('descricao') as string,
            precoHora: Number(formData.get('precoHora')),
            horarioAbertura: formData.get('horarioAbertura') as string,
            horarioFechamento: formData.get('horarioFechamento') as string,
            duracaoSlot: Number(formData.get('duracaoSlot')),
            tipo: 'beach_tennis' as any,
            ativa: true
        };

        try {
            if (selectedQuadra?.id) {
                await updateQuadra(selectedQuadra.id, quadraData);
            } else {
                await addQuadra(quadraData);
            }
            setShowQuadraDialog(false);
            setSelectedQuadra(null);
        } catch (error) {
            // Error toast handled in hook
        }
    };

    const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!selectedUser) return;

        try {
            await updateUsuario(selectedUser.id, {
                nome: formData.get('nome') as string,
                email: formData.get('email') as string,
                nivel: formData.get('nivel') as any,
                telefone: formData.get('telefone') as string,
                role: formData.get('role') as any,
            });
            setShowUserEditDialog(false);
            setSelectedUser(null);
            toast.success('Atleta atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar atleta');
        }
    };

    const handleChargeUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!selectedUser) return;

        try {
            await addPagamento({
                usuarioId: selectedUser.id,
                valor: Number(formData.get('valor')),
                descricao: formData.get('descricao') as string,
                tipo: 'aula',
                status: 'pendente',
                dataVencimento: new Date(),
                createdAt: new Date()
            } as any);
            setShowChargeDialog(false);
            setSelectedUser(null);
            toast.success('Cobrança lançada com sucesso!');
        } catch (error) {
            toast.error('Erro ao lançar cobrança');
        }
    };

    const handleSaveProfessor = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const modalitiesInput = formData.get('modalidades') as string;

        const profData = {
            nome: formData.get('nome') as string,
            email: formData.get('email') as string,
            telefone: formData.get('telefone') as string,
            modalidades: modalitiesInput.split(',').map(m => m.trim()),
            comissao: Number(formData.get('comissao')),
            bio: formData.get('bio') as string,
            ativa: true,
            createdAt: new Date()
        };

        try {
            if (selectedProfessor?.id) {
                await updateProfessor(selectedProfessor.id, profData);
                toast.success('Professor atualizado!');
            } else {
                await addProfessor(profData as any);
                toast.success('Professor cadastrado!');
            }
            setShowProfessorDialog(false);
            setSelectedProfessor(null);
        } catch (error) {
            toast.error('Erro ao salvar professor');
        }
    };

    return (
        <div className="min-h-screen pb-24 bg-sand-50 dark:bg-sand-dark-50">
            {/* Beach Premium Header - matches PAINEL PISTA */}
            <div className="bg-white dark:bg-sand-dark-100 border-b border-sand-200 dark:border-sand-dark-200 px-6 py-6 sticky top-0 z-20">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-dark" />
                            <span className="text-[9px] text-teal-600 dark:text-teal-dark font-bold uppercase tracking-widest">AMBIENTE SEGURO</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">
                            <span className="text-teal-600 dark:text-teal-dark">PAINEL </span>
                            <span className="text-coral-500 dark:text-coral-dark">PISTA</span>
                        </h1>
                        <p className="text-[11px] text-coral-500 dark:text-coral-dark font-bold uppercase tracking-wide mt-0.5">Gestão Inteligente da Arena</p>
                    </div>
                    <div className="w-11 h-11 bg-teal-600/10 dark:bg-teal-dark/10 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-dark" />
                    </div>
                </div>

                {/* Module Selector - Beach Premium Dropdown */}
                <div>
                    <Select value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                        <SelectTrigger className="w-full bg-sand-100 dark:bg-sand-dark-200 border-sand-200 dark:border-sand-dark-200 rounded-2xl h-14 font-black text-sand-900 dark:text-sand-dark-900 uppercase tracking-wide shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white dark:bg-sand-dark-100 rounded-xl flex items-center justify-center">
                                    {activeTab === 'financeiro' && <DollarSign className="w-4 h-4 text-sand-900 dark:text-sand-dark-900" />}
                                    {activeTab === 'usuarios' && <Users className="w-4 h-4 text-sand-900 dark:text-sand-dark-900" />}
                                    {activeTab === 'professores' && <GraduationCap className="w-4 h-4 text-sand-900 dark:text-sand-dark-900" />}
                                    {activeTab === 'quadras' && <Palmtree className="w-4 h-4 text-sand-900 dark:text-sand-dark-900" />}
                                </div>
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-sand-dark-100 border-sand-200 dark:border-sand-dark-200 rounded-2xl z-50">
                            <SelectItem value="financeiro" className="font-black uppercase tracking-wide">Financeiro</SelectItem>
                            <SelectItem value="usuarios" className="font-black uppercase tracking-wide">Jogadores</SelectItem>
                            <SelectItem value="professores" className="font-black uppercase tracking-wide">Professores</SelectItem>
                            <SelectItem value="quadras" className="font-black uppercase tracking-wide">Quadras</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="p-6">
                {/* Search Bar - Beach Premium */}
                {(activeTab === 'usuarios' || activeTab === 'financeiro' || activeTab === 'professores') && (
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600 dark:text-teal-dark" />
                        <input
                            type="text"
                            placeholder="BUSCAR..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-sand-dark-100 border border-sand-200 dark:border-sand-dark-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-sand-900 dark:text-sand-dark-900 focus:ring-2 focus:ring-teal-600/20 dark:focus:ring-teal-dark/ 20 focus:border-teal-600 dark:focus:border-teal-dark transition-all outline-none placeholder:text-sand-400 dark:placeholder:text-sand-dark-400 placeholder:font-normal uppercase tracking-wide"
                        />
                    </div>
                )}

                {activeTab === 'financeiro' && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-black text-sand-900 dark:text-sand-dark-900 uppercase tracking-wider px-1">PAGAMENTOS PENDENTES</h2>
                        {pagamentos?.filter(p => p.status === 'pendente').map(pag => (
                            <div key={pag.id} className="bg-white dark:bg-sand-dark-100 p-6 rounded-3xl border border-sand-200 dark:border-sand-dark-200 shadow-card flex items-center justify-between group hover:border-teal-600/40 dark:hover:border-teal-dark/40 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-coral-500/10 dark:bg-coral-dark/10 flex items-center justify-center border-2 border-coral-500/20 dark:border-coral-dark/20 group-hover:bg-coral-500 group-hover:border-coral-500 transition-all">
                                        <Clock className="w-6 h-6 text-coral-500 dark:text-coral-dark group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-sand-900 dark:text-sand-dark-900 leading-none mb-1">{usuarios?.find(u => u.id === pag.usuarioId)?.nome}</h4>
                                        <p className="text-[10px] font-bold text-sand-400 dark:text-sand-dark-400 uppercase tracking-tight">{pag.descricao}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="text-right">
                                        <p className="text-lg font-black text-coral-500 dark:text-coral-dark leading-none mb-0.5">R$ {pag.valor}</p>
                                        <p className="text-[8px] font-bold text-sand-400 dark:text-sand-dark-400 uppercase tracking-tight">Vence {new Date(pag.dataVencimento).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleConfirmPayment(pag.id)}
                                        className="h-10 px-5 bg-teal-600 dark:bg-teal-dark text-white rounded-2xl hover:scale-105 shadow-button-teal active:scale-95 transition-all text-[10px] font-black uppercase tracking-wide"
                                    >
                                        Pagar
                                    </button>
                                </div>
                            </div>
                        ))}
                        {pagamentos?.filter(p => p.status === 'pendente').length === 0 && (
                            <EmptyState
                                icon={DollarSign}
                                title="Tudo em dia!"
                                description="Nenhum pagamento pendente encontrado no sistema no momento."
                                color="emerald"
                            />
                        )}
                    </div>
                )}

                {activeTab === 'usuarios' && (
                    <div className="space-y-3">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-2">Gestão de Alunos</h2>
                        {filteredUsuarios?.map(user => (
                            <div key={user.id} className="bg-white p-6 rounded-[35px] border-2 border-gray-50 shadow-xl shadow-gray-200/10 hover:border-teal-500/20 transition-all group">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl relative">
                                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <Users className="w-7 h-7 text-gray-200" />}
                                            {user.financeiro?.mensalista && (
                                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-gray-900 leading-tight">{user.nome}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-lg bg-gray-100 text-gray-400 tracking-widest border border-gray-200/50">
                                                    {user.role}
                                                </span>
                                                {user.nivel && (
                                                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-lg bg-teal-50 text-teal-600 tracking-widest border border-teal-100/50">
                                                        {user.nivel}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border ${user.financeiro?.mensalista ? 'bg-teal-500 text-white border-teal-400 shadow-lg shadow-teal-500/20' : 'bg-white text-gray-400 border-gray-100 uppercase tracking-widest font-black'}`}>
                                            {user.financeiro?.mensalista ? 'MENSALISTA' : 'AVULSO'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2.5">
                                    <button
                                        onClick={() => handleToggleMensalista(user)}
                                        className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-[20px] shadow-lg transition-all active:scale-95 ${user.financeiro?.mensalista ? 'bg-gray-100 text-gray-500 shadow-gray-200/20 hover:bg-gray-200' : 'bg-[#0f172a] text-white shadow-slate-900/20 hover:bg-slate-800'}`}
                                    >
                                        {user.financeiro?.mensalista ? 'Suspender Plano' : 'Ativar Mensalista'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowUserEditDialog(true);
                                        }}
                                        className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-[20px] hover:bg-teal-50 hover:text-teal-600 hover:border-teal-100 border border-transparent transition-all"
                                        title="Editar Perfil"
                                    >
                                        <Edit className="w-4.5 h-4.5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowChargeDialog(true);
                                        }}
                                        className="w-12 h-12 flex items-center justify-center bg-orange-50 text-orange-400 rounded-[20px] hover:bg-orange-500 hover:text-white border border-transparent transition-all shadow-sm"
                                        title="Lançar Cobrança"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'quadras' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2 mb-2">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Configurações de Quadras</h2>
                            <button
                                onClick={() => {
                                    setSelectedQuadra(null);
                                    setShowQuadraDialog(true);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider shadow-md active:scale-95 transition-all"
                            >
                                <Plus className="w-3 h-3" /> Nova Quadra
                            </button>
                        </div>

                        {quadras.map(quadra => (
                            <div key={quadra.id} className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-xl shadow-gray-200/20 group hover:border-teal-500/30 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-5">
                                        <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-teal-100 rounded-[24px] flex items-center justify-center border border-teal-200 shadow-inner group-hover:from-teal-500 group-hover:to-teal-600 transition-all group-hover:shadow-[0_10px_20px_rgba(20,184,166,0.3)]">
                                            <Palmtree className="w-8 h-8 text-teal-600 group-hover:text-white transition-all" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight mb-1">{quadra.nome}</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed max-w-[180px]">{quadra.descricao}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-tighter mb-1">Taxa/Hora</p>
                                        <span className="block text-xl font-black text-teal-600">R$ {quadra.precoHora}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 mt-6">
                                    <button
                                        onClick={() => {
                                            setSelectedQuadra(quadra);
                                            setShowQuadraDialog(true);
                                        }}
                                        className="flex-1 py-4 bg-gray-50 border-2 border-transparent text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-[20px] hover:bg-white hover:border-teal-500 hover:text-teal-600 flex items-center justify-center gap-2.5 transition-all shadow-sm"
                                    >
                                        <Edit className="w-4 h-4" /> Detalhes
                                    </button>
                                    <button
                                        onClick={() => toast.info('Funcionalidade de desativar em breve')}
                                        className="w-14 h-14 bg-white border-2 border-gray-50 text-orange-400 rounded-[20px] hover:bg-orange-50 hover:text-orange-500 hover:border-orange-100 flex items-center justify-center transition-all shadow-sm"
                                    >
                                        <AlertCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'professores' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2 mb-2">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Gestão de Professores</h2>
                            <button
                                onClick={() => {
                                    setSelectedProfessor(null);
                                    setShowProfessorDialog(true);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider shadow-md active:scale-95 transition-all"
                            >
                                <Plus className="w-3 h-3" /> Novo Professor
                            </button>
                        </div>

                        {professores?.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase())).map(prof => (
                            <div key={prof.id} className="bg-white p-6 rounded-[35px] border border-gray-100 shadow-xl shadow-gray-200/20 space-y-5 hover:border-teal-500/20 transition-all group">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 bg-teal-50 rounded-[22px] flex items-center justify-center border-2 border-white shadow-2xl overflow-hidden text-teal-500 relative">
                                            {prof.avatar ? <img src={prof.avatar} className="w-full h-full object-cover" /> : <GraduationCap className="w-7 h-7" />}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">{prof.nome}</h3>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {prof.modalidades.map(mod => (
                                                    <span key={mod} className="text-[8px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-lg uppercase tracking-widest border border-gray-200/50">
                                                        {mod}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xl font-black text-teal-600">{prof.comissao}%</span>
                                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">COMISSÃO</span>
                                    </div>
                                </div>

                                <div className="flex gap-2.5">
                                    <button
                                        onClick={() => {
                                            setSelectedProfessor(prof);
                                            setShowProfessorDialog(true);
                                        }}
                                        className="flex-1 py-4 bg-gray-50 border-2 border-transparent text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-[20px] hover:bg-white hover:border-teal-500 hover:text-teal-600 flex items-center justify-center gap-2.5 transition-all shadow-sm"
                                    >
                                        <Edit className="w-4 h-4" /> Perfil
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedProfessorForAgenda(prof);
                                            setShowTeacherAgenda(true);
                                        }}
                                        className="flex-[1.5] py-4 bg-[#0f172a] text-white text-[10px] font-black uppercase tracking-widest rounded-[20px] hover:bg-slate-800 flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-slate-900/20"
                                    >
                                        <Calendar className="w-4 h-4 text-teal-400" /> Ver Agenda
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quadra Dialog */}
            <Dialog open={showQuadraDialog} onOpenChange={setShowQuadraDialog}>
                <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
                    <div className="bg-sand-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center border border-teal-500/30">
                                <Palmtree className="w-5 h-5 text-teal-400" />
                            </div>
                            {selectedQuadra ? 'Editar Quadra' : 'Nova Quadra'}
                        </h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-3 relative z-10 ml-0.5">Configuração de Infraestrutura</p>
                    </div>

                    <form onSubmit={handleSaveQuadra} className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nome da Quadra</Label>
                            <Input
                                name="nome"
                                defaultValue={selectedQuadra?.nome}
                                placeholder="Ex: Pista Resenha Beach"
                                required
                                className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Descrição / Subtítulo</Label>
                            <Input
                                name="descricao"
                                defaultValue={selectedQuadra?.descricao}
                                placeholder="Ex: Areia Fina • Iluminação Noturna"
                                required
                                className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Preço por Hora (R$)</Label>
                                <Input
                                    name="precoHora"
                                    type="number"
                                    defaultValue={selectedQuadra?.precoHora || 120}
                                    required
                                    className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Duração Slot (min)</Label>
                                <Input
                                    name="duracaoSlot"
                                    type="number"
                                    defaultValue={selectedQuadra?.duracaoSlot || 60}
                                    required
                                    className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Abertura</Label>
                                <Input
                                    name="horarioAbertura"
                                    type="time"
                                    defaultValue={selectedQuadra?.horarioAbertura || "07:00"}
                                    required
                                    className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Fechamento</Label>
                                <Input
                                    name="horarioFechamento"
                                    type="time"
                                    defaultValue={selectedQuadra?.horarioFechamento || "22:00"}
                                    required
                                    className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-teal-500 text-white font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all mt-4"
                        >
                            {selectedQuadra ? 'Salvar Alterações' : 'Criar Quadra'}
                        </button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={showUserEditDialog} onOpenChange={setShowUserEditDialog}>
                <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
                    <div className="bg-sand-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center border border-teal-500/30">
                                <Users className="w-5 h-5 text-teal-400" />
                            </div>
                            Editar Atleta
                        </h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-3 relative z-10 ml-0.5">Gestão de Perfil e Acesso</p>
                    </div>

                    <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nome</Label>
                            <Input name="nome" defaultValue={selectedUser?.nome} required className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">WhatsApp</Label>
                            <Input name="telefone" defaultValue={selectedUser?.telefone} placeholder="(00) 00000-0000" className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nível</Label>
                            <select
                                name="nivel"
                                defaultValue={selectedUser?.nivel}
                                className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="iniciante">Iniciante</option>
                                <option value="intermediario">Intermediário</option>
                                <option value="avancado">Avançado</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Função (Role)</Label>
                            <select
                                name="role"
                                defaultValue={selectedUser?.role}
                                className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="user">Atleta (User)</option>
                                <option value="professor">Professor</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black uppercase text-xs tracking-widest shadow-lg mt-2">
                            Salvar Alterações
                        </button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Charge User Dialog */}
            <Dialog open={showChargeDialog} onOpenChange={setShowChargeDialog}>
                <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
                    <div className="bg-orange-500 p-6 text-white">
                        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Lançar Cobrança
                        </h3>
                        <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">Aula avulsa ou consumo</p>
                    </div>

                    <form onSubmit={handleChargeUser} className="p-6 space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                                <img src={selectedUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser?.id}`} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Atleta</p>
                                <p className="text-sm font-black text-gray-900">{selectedUser?.nome}</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Descrição</Label>
                            <Input name="descricao" placeholder="Ex: Aula Avulsa 28/Jan" required className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Valor (R$)</Label>
                            <Input name="valor" type="number" defaultValue={25} required className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold" />
                        </div>

                        <button type="submit" className="w-full py-4 rounded-2xl bg-orange-500 text-white font-black uppercase text-xs tracking-widest shadow-lg mt-2">
                            Confirmar Cobrança
                        </button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Professor Dialog */}
            <Dialog open={showProfessorDialog} onOpenChange={setShowProfessorDialog}>
                <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
                    <div className="bg-sand-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center border border-teal-500/30">
                                <GraduationCap className="w-5 h-5 text-teal-200" />
                            </div>
                            {selectedProfessor ? 'Editar Professor' : 'Novo Professor'}
                        </h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-3 relative z-10 ml-0.5">Gestão de Instrutores</p>
                    </div>

                    <form onSubmit={handleSaveProfessor} className="p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nome Completo</Label>
                            <Input name="nome" defaultValue={selectedProfessor?.nome} placeholder="Ex: Prof. Ricardo Silva" required className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold" />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email (para acesso)</Label>
                            <Input name="email" type="email" defaultValue={selectedProfessor?.email} placeholder="professor@arena.com" required className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">WhatsApp</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <Input name="telefone" defaultValue={selectedProfessor?.telefone} placeholder="(00) 00000-0000" className="pl-10 bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Comissão (%)</Label>
                                <Input name="comissao" type="number" defaultValue={selectedProfessor?.comissao || 70} required className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Modalidades (separadas por vírgula)</Label>
                            <Input name="modalidades" defaultValue={selectedProfessor?.modalidades?.join(', ')} placeholder="Beach Tennis, Vôlei" required className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold" />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Biografia Curta</Label>
                            <textarea
                                name="bio"
                                defaultValue={selectedProfessor?.bio}
                                rows={2}
                                className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                placeholder="Falé um pouco sobre a experiência do professor..."
                            />
                        </div>

                        <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest shadow-lg mt-2 active:scale-95 transition-all">
                            {selectedProfessor ? 'Salvar Alterações' : 'Cadastrar Professor'}
                        </button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Teacher Agenda Dialog */}
            <Dialog open={showTeacherAgenda} onOpenChange={setShowTeacherAgenda}>
                <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
                    <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-black/5" />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
                                <Calendar className="w-8 h-8 text-indigo-100" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Agenda: {selectedProfessorForAgenda?.nome}</h3>
                            <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mt-1">Controle de aulas e horários</p>
                        </div>
                    </div>

                    <div className="bg-gray-100/50 border-b border-gray-100">
                        <div className="flex gap-2 overflow-x-auto px-6 py-5 no-scrollbar">
                            {dateStrip.map((date, i) => {
                                const active = isSameDay(date, selectedDate);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex flex-col items-center justify-center min-w-[54px] h-16 rounded-2xl transition-all ${active
                                            ? 'bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] scale-105'
                                            : 'bg-white text-gray-400 border border-gray-100 hover:border-indigo-200'
                                            }`}
                                    >
                                        <span className={`text-[9px] font-black uppercase tracking-tighter mb-0.5 ${active ? 'opacity-70' : 'opacity-40'}`}>
                                            {format(date, 'EEE', { locale: ptBR }).replace('.', '')}
                                        </span>
                                        <span className="text-base font-black leading-none">
                                            {format(date, 'd')}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 space-y-5 max-h-[450px] overflow-y-auto custom-scrollbar bg-gray-50/30">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aulas & Compromissos</h4>
                                <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                                    {teacherAgendamentos?.length || 0} aulas
                                </span>
                            </div>

                            {teacherAgendamentos && teacherAgendamentos.length > 0 ? (
                                teacherAgendamentos.map(agen => (
                                    <div key={agen.id} className="p-4 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between hover:border-indigo-200 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Clock className="w-5 h-5 text-indigo-500 group-hover:text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-none mb-1">
                                                    {format(new Date(agen.horarioInicio), 'HH:mm')} — {format(new Date(agen.horarioFim), 'HH:mm')}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                                                    <Palmtree className="w-2.5 h-2.5" />
                                                    {quadras.find(q => q.id === agen.quadraId)?.nome || 'Reserva Arena'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex -space-x-2 justify-end mb-1.5">
                                                {agen.jogadoresInfo?.slice(0, 3).map((jug, idx) => (
                                                    <div key={idx} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 shadow-sm overflow-hidden" title={jug.nome}>
                                                        {jug.avatar ? <img src={jug.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-gray-500">{jug.nome[0]}</div>}
                                                    </div>
                                                ))}
                                                {(agen.jogadoresInfo?.length ?? 0) > 3 && (
                                                    <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white shadow-sm">
                                                        +{(agen.jogadoresInfo?.length ?? 0) - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[8px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Confirmada</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center bg-white rounded-[35px] border-2 border-dashed border-gray-100 shadow-inner">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Calendar className="w-6 h-6 text-indigo-200" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Sem aulas programadas</p>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Tudo limpo para este dia!</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-indigo-900 p-5 rounded-[28px] shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
                            <div className="flex gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <DollarSign className="w-5 h-5 text-indigo-300" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest mb-1">Resumo Financeiro</p>
                                    <p className="text-[10px] font-bold text-white/80 leading-relaxed uppercase">
                                        Comissão: <span className="text-white font-black">{selectedProfessorForAgenda?.comissao}%</span> de repasse direto.
                                        Total estimado hoje: <span className="text-teal-400 font-black">R$ {(teacherAgendamentos?.length || 0) * (selectedProfessorForAgenda?.comissao || 0)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-2 bg-gray-50/30">
                        <button
                            onClick={() => setShowTeacherAgenda(false)}
                            className="w-full py-5 rounded-[24px] bg-gray-900 text-white font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                        >
                            Fechar Agenda
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}


