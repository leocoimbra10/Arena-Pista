import { useAuth } from '@/contexts/AuthContext';
import { useUserAgendamentos } from '@/hooks/useFirestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    GraduationCap,
    Calendar,
    Users,
    Clock,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

export function ProfessorSection() {
    const { userData } = useAuth();
    const { agendamentos } = useUserAgendamentos(userData?.id);

    // Security: Only professors
    if (userData?.role !== 'professor') {
        return (
            <div className="min-h-screen bg-sand-50 dark:bg-sand-dark-50 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-sand-dark-100 rounded-3xl shadow-card p-8 max-w-md text-center">
                    <GraduationCap className="w-16 h-16 mx-auto mb-4 text-coral-500 dark:text-coral-dark" />
                    <h2 className="text-2xl font-black text-sand-900 dark:text-sand-dark-900 mb-2">Acesso Restrito</h2>
                    <p className="text-sm text-sand-400 dark:text-sand-dark-400 mb-6">
                        Esta área é exclusiva para professores credenciados. Se você é professor, entre em contato com a administração.
                    </p>
                    <div className="bg-sand-100 dark:bg-sand-dark-200 rounded-2xl p-4">
                        <p className="text-xs font-bold text-sand-900 dark:text-sand-dark-900 uppercase tracking-tight">
                            Seu perfil atual: {userData?.role || 'atleta'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Filter classes taught by this professor
    const minhasAulas = agendamentos?.filter(a => a.professorId === userData?.id && a.tipo === 'aula') || [];
    const aulasHoje = minhasAulas.filter(a => format(new Date(), 'yyyy-MM-dd') === format(a.data, 'yyyy-MM-dd'));
    const proximasAulas = minhasAulas.filter(a => a.data > new Date()).slice(0, 5);

    // Calculate stats
    const totalAulas = minhasAulas.length;
    // const totalAlunos = new Set(minhasAulas.map(a => a.usuarioId)).size; // TODO: Add usuarioId to Agendamento type
    const totalAlunos = 0; // Placeholder until usuarioId is added to type

    return (
        <div className="min-h-screen pb-24 bg-sand-50 dark:bg-sand-dark-50">
            {/* Beach Premium Header */}
            <div className="bg-white dark:bg-sand-dark-100 border-b border-sand-200 dark:border-sand-dark-200 px-6 py-6 sticky top-0 z-20 shadow-card">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-dark" />
                            <span className="text-[9px] text-teal-600 dark:text-teal-dark font-bold uppercase tracking-widest">PROFESSOR CREDENCIADO</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">
                            <span className="text-teal-600 dark:text-teal-dark">MINHAS </span>
                            <span className="text-coral-500 dark:text-coral-dark">AULAS</span>
                        </h1>
                        <p className="text-[11px] text-sand-900 dark:text-sand-dark-900 font-bold uppercase tracking-wide mt-0.5">Olá, Prof. {userData?.nome}!</p>
                    </div>
                    <div className="w-11 h-11 bg-teal-600/10 dark:bg-teal-dark/10 rounded-2xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-dark" />
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-sand-dark-100 rounded-3xl shadow-card p-4 border border-sand-200 dark:border-sand-dark-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-teal-600/10 dark:bg-teal-dark/10 rounded-2xl flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-dark" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-sand-900 dark:text-sand-dark-900 leading-none">{totalAulas}</p>
                                <p className="text-[9px] font-bold text-sand-400 dark:text-sand-dark-400 uppercase tracking-tight">Total Aulas</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-sand-dark-100 rounded-3xl shadow-card p-4 border border-sand-200 dark:border-sand-dark-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-coral-500/10 dark:bg-coral-dark/10 rounded-2xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-coral-500 dark:text-coral-dark" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-sand-900 dark:text-sand-dark-900 leading-none">{totalAlunos}</p>
                                <p className="text-[9px] font-bold text-sand-400 dark:text-sand-dark-400 uppercase tracking-tight">Alunos Ativos</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Classes */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-sand-400 dark:text-sand-dark-400 uppercase tracking-[0.2em]">Aulas de Hoje</h3>
                        <span className="text-xs font-bold text-teal-600 dark:text-teal-dark">{aulasHoje.length} aulas</span>
                    </div>

                    {aulasHoje.length === 0 ? (
                        <div className="bg-white dark:bg-sand-dark-100 rounded-3xl shadow-card p-8 text-center border border-sand-200 dark:border-sand-dark-200">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-sand-400 dark:text-sand-dark-400 opacity-50" />
                            <p className="text-sm font-bold text-sand-400 dark:text-sand-dark-400">Nenhuma aula agendada para hoje</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {aulasHoje.map((aula) => (
                                <div key={aula.id} className="bg-white dark:bg-sand-dark-100 rounded-3xl shadow-card p-4 border border-sand-200 dark:border-sand-dark-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-teal-600 dark:text-teal-dark" />
                                            <span className="text-sm font-black text-sand-900 dark:text-sand-dark-900">
                                                {format(aula.horarioInicio || aula.data, 'HH:mm')} - {format(aula.horarioFim || aula.data, 'HH:mm')}
                                            </span>
                                        </div>
                                        {aula.status === 'confirmado' ? (
                                            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-dark" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-coral-500 dark:text-coral-dark" />
                                        )}
                                    </div>
                                    <p className="text-xs font-bold text-sand-400 dark:text-sand-dark-400 uppercase">Aluno: Nome do Aluno</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Próximas Aulas */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-sand-400 dark:text-sand-dark-400 uppercase tracking-[0.2em] px-1">Próximas Aulas</h3>
                    {proximasAulas.length === 0 ? (
                        <div className="bg-white dark:bg-sand-dark-100 rounded-3xl shadow-card p-6 text-center border border-sand-200 dark:border-sand-dark-200">
                            <p className="text-sm font-bold text-sand-400 dark:text-sand-dark-400">Nenhuma aula agendada</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {proximasAulas.map((aula) => (
                                <div key={aula.id} className="bg-white dark:bg-sand-dark-100 rounded-3xl shadow-card p-4 border border-sand-200 dark:border-sand-dark-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-black text-sand-900 dark:text-sand-dark-900 mb-1">
                                                {format(aula.data, "dd 'de' MMMM", { locale: ptBR })}
                                            </p>
                                            <p className="text-xs font-bold text-sand-400 dark:text-sand-dark-400 uppercase">
                                                {format(aula.horarioInicio || aula.data, 'HH:mm')} - {format(aula.horarioFim || aula.data, 'HH:mm')}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${aula.status === 'confirmado'
                                            ? 'bg-teal-600/10 dark:bg-teal-dark/10 text-teal-600 dark:text-teal-dark'
                                            : 'bg-coral-500/10 dark:bg-coral-dark/10 text-coral-500 dark:text-coral-dark'
                                            }`}>
                                            {aula.status || 'pendente'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
