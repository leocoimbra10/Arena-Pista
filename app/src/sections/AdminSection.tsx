import { useState } from 'react';
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
    ChevronDown,
    Calendar
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function AdminSection() {
    const [activeTab, setActiveTab] = useState<'financeiro' | 'quadras' | 'usuarios' | 'professores'>('financeiro');
    const { data: usuarios, update: updateUsuario } = useCollection<Usuario>('users');
    const { quadras, addQuadra, updateQuadra } = useQuadras();
    const [showQuadraDialog, setShowQuadraDialog] = useState(false);
    const [showUserEditDialog, setShowUserEditDialog] = useState(false);
    const [showChargeDialog, setShowChargeDialog] = useState(false);
    const [showProfessorDialog, setShowProfessorDialog] = useState(false);
    const [showModulePicker, setShowModulePicker] = useState(false);
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
        <div className="min-h-screen pb-24 bg-[#F7F5F2]">
            {/* Premium Header Admin */}
            <div className="bg-[#0f172a] text-white px-6 pb-12 pt-10 rounded-b-[50px] shadow-2xl relative">
                {/* Decorative Elements */}
                <div className="absolute inset-0 rounded-b-[50px] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-teal-500/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px]" />
                </div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                            <span className="text-[10px] text-teal-400 font-black uppercase tracking-[0.3em]">Ambiente Seguro</span>
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Painel <span className="text-teal-400">Pista</span></h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Gestão Inteligente da Arena</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-[22px] flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(20,184,166,0.5)] transform rotate-6 border-4 border-white/10">
                        <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                </div>

                {/* Modern Module Selector (Switch) */}
                <div className="relative z-20">
                    <button
                        onClick={() => setShowModulePicker(!showModulePicker)}
                        className={`w-full bg-white/5 border border-white/10 p-5 rounded-[28px] flex items-center justify-between transition-all duration-300 ${showModulePicker ? 'bg-white/10 border-white/20 ring-4 ring-teal-500/10' : 'hover:bg-white/[0.07]'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:border-teal-500/50 transition-all">
                                {activeTab === 'financeiro' && <DollarSign className="w-6 h-6 text-teal-400" />}
                                {activeTab === 'usuarios' && <Users className="w-6 h-6 text-teal-400" />}
                                {activeTab === 'professores' && <GraduationCap className="w-6 h-6 text-teal-400" />}
                                {activeTab === 'quadras' && <Palmtree className="w-6 h-6 text-teal-400" />}
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Visão Atual</p>
                                <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none">
                                    {activeTab === 'financeiro' && 'Financeiro'}
                                    {activeTab === 'usuarios' && 'Atletas'}
                                    {activeTab === 'professores' && 'Professores'}
                                    {activeTab === 'quadras' && 'Quadras'}
                                </h2>
                            </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all duration-500 ${showModulePicker ? 'rotate-180 bg-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)]' : 'text-gray-400'}`}>
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </button>

                    {/* Module Picker Dropdown */}
                    {showModulePicker && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowModulePicker(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-4 bg-[#1a1a2e]/95 border border-white/10 backdrop-blur-2xl rounded-[35px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-20 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-white/10">
                                <div className="p-3 grid grid-cols-1 gap-1">
                                    {[
                                        { id: 'financeiro', label: 'Financeiro', icon: DollarSign, desc: 'Fluxo de caixa e pendências', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                                        { id: 'usuarios', label: 'Atletas', icon: Users, desc: 'Gestão de membros e mensalistas', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                                        { id: 'professores', label: 'Professores', icon: GraduationCap, desc: 'Agenda de aulas e comissões', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                                        { id: 'quadras', label: 'Quadras', icon: Palmtree, desc: 'Configuração de infraestrutura', color: 'text-teal-400', bg: 'bg-teal-400/10' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id as any);
                                                setShowModulePicker(false);
                                            }}
                                            className={`w-full flex items-center gap-4 p-4 rounded-[24px] transition-all duration-200 ${activeTab === tab.id ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 ${activeTab === tab.id ? 'bg-teal-500 text-white shadow-lg' : 'bg-gray-900 text-gray-400'}`}>
                                                <tab.icon className="w-6 h-6" />
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className={`text-[11px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'text-teal-400' : 'text-white'}`}>{tab.label}</p>
                                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter mt-0.5">{tab.desc}</p>
                                            </div>
                                            {activeTab === tab.id && (
                                                <div className="w-1.5 h-6 bg-teal-500 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.6)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="p-6">
                {/* Search Bar */}
                {(activeTab === 'usuarios' || activeTab === 'financeiro' || activeTab === 'professores') && (
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar atleta pelo nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-teal-500 transition-all outline-none shadow-sm"
                        />
                    </div>
                )}

                {activeTab === 'financeiro' && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-2">Pagamentos Pendentes</h2>
                        {pagamentos?.filter(p => p.status === 'pendente').map(pag => (
                            <div key={pag.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900">{usuarios?.find(u => u.id === pag.usuarioId)?.nome}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{pag.descricao}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-amber-600">R$ {pag.valor}</p>
                                        <p className="text-[9px] font-bold text-gray-400 italic">Vence em: {new Date(pag.dataVencimento).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleConfirmPayment(pag.id)}
                                        className="p-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 shadow-md active:scale-95 transition-all text-[10px] font-black uppercase"
                                    >
                                        Baixa
                                    </button>
                                </div>
                            </div>
                        ))}
                        {pagamentos?.filter(p => p.status === 'pendente').length === 0 && (
                            <p className="text-center py-12 text-sm text-gray-400 italic">Nenhum pagamento pendente no momento.</p>
                        )}
                    </div>
                )}

                {activeTab === 'usuarios' && (
                    <div className="space-y-3">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-2">Gestão de Alunos</h2>
                        {filteredUsuarios?.map(user => (
                            <div key={user.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-gray-300" />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900">{user.nome}</h4>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${user.financeiro?.mensalista ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-400'}`}>
                                            {user.financeiro?.mensalista ? 'MENSALISTA' : 'AVULSO'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleMensalista(user)}
                                        className="flex-1 py-2.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-md"
                                    >
                                        {user.financeiro?.mensalista ? 'Tornar Avulso' : 'Tornar Mensalista'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowUserEditDialog(true);
                                        }}
                                        className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                                        title="Editar Perfil"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setShowChargeDialog(true);
                                        }}
                                        className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100"
                                        title="Cobrar Aula"
                                    >
                                        <Plus className="w-4 h-4" />
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
                            <div key={quadra.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-md">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                                            <Palmtree className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900 uppercase">{quadra.nome}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">{quadra.descricao}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-black text-teal-600">R$ {quadra.precoHora}</span>
                                        <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">VALOR BASE</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-5">
                                    <button
                                        onClick={() => {
                                            setSelectedQuadra(quadra);
                                            setShowQuadraDialog(true);
                                        }}
                                        className="flex-1 py-3 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-3.5 h-3.5" /> Editar
                                    </button>
                                    <button
                                        onClick={() => toast.info('Funcionalidade de desativar em breve')}
                                        className="flex-1 py-3 bg-white border border-red-50 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-50 flex items-center justify-center gap-2"
                                    >
                                        <AlertCircle className="w-3.5 h-3.5" /> Desativar
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
                            <div key={prof.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-indigo-500">
                                            {prof.avatar ? <img src={prof.avatar} className="w-full h-full object-cover" /> : <GraduationCap className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900 uppercase">{prof.nome}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {prof.modalidades.map(mod => (
                                                    <span key={mod} className="text-[7px] font-black bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                                                        {mod}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-black text-indigo-600">{prof.comissao}%</span>
                                        <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">COMISSÃO</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedProfessor(prof);
                                            setShowProfessorDialog(true);
                                        }}
                                        className="flex-1 py-3 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-3.5 h-3.5" /> Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedProfessorForAgenda(prof);
                                            setShowTeacherAgenda(true);
                                        }}
                                        className="flex-1 py-3 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 flex items-center justify-center gap-2"
                                    >
                                        <Calendar className="w-3.5 h-3.5" /> Agenda
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
                    <div className="bg-gray-900 p-6 text-white">
                        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <Palmtree className="w-5 h-5 text-teal-400" />
                            {selectedQuadra ? 'Editar Quadra' : 'Nova Quadra'}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configurações de infraestrutura</p>
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
                    <div className="bg-gray-900 p-6 text-white">
                        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <Users className="w-5 h-5 text-teal-400" />
                            Editar Atleta
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gestão de perfil e nível</p>
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
                    <div className="bg-indigo-600 p-6 text-white">
                        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-indigo-200" />
                            {selectedProfessor ? 'Editar Professor' : 'Novo Professor'}
                        </h3>
                        <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mt-1">Cadastro de instrutores e modalidades</p>
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


