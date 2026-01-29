import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import { BeachButton } from '@/components/BeachButton';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  Waves
} from 'lucide-react';
import { toast } from 'sonner';

export function AuthSection() {
  const { login, register, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ nome: '', email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(registerData.email, registerData.password, registerData.nome);
      toast.success('Conta criada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Login com Google realizado!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Full-Screen Background - Golden Hour Beach Scene */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/beach-bg.jpg')`, // TODO: Replace with actual generated image
        }}
      >
        {/* Dark Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-sand-900/80 via-sand-900/40 to-transparent" />
      </div>

      {/* Floating Glassmorphism Login Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Frosted Glass Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-600 to-teal-500 mb-4 shadow-button-teal">
                <Waves className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                PISTA <span className="text-coral-500">RESENHA</span>
              </h1>
              <p className="text-lg font-bold text-white/90 uppercase tracking-wide">Sua Arena, Sua Vibe.</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 p-1 bg-white/10 rounded-2xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-xl font-black uppercase text-sm tracking-tight transition-all ${isLogin
                  ? 'bg-teal-600 text-white shadow-button-teal'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-xl font-black uppercase text-sm tracking-tight transition-all ${!isLogin
                  ? 'bg-coral-500 text-white shadow-button-coral'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 uppercase tracking-wide mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-sand-900 placeholder:text-sand-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-teal-600/50 focus:border-teal-600 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 uppercase tracking-wide mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-bold text-sand-900 placeholder:text-sand-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-teal-600/50 focus:border-teal-600 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <BeachButton
                  type="submit"
                  variant="primary-teal"
                  size="lg"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Entrando...' : 'Entrar na Arena'}
                </BeachButton>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-transparent px-3 text-white/60 font-bold uppercase tracking-wide">Ou</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white/90 hover:bg-white border border-white/30 rounded-2xl px-6 py-3.5 font-black text-sand-900 uppercase text-sm tracking-tight transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Chrome className="w-5 h-5" />
                  Google
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/80 uppercase tracking-wide mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-coral-500" />
                    <input
                      type="text"
                      placeholder="Seu Nome"
                      value={registerData.nome}
                      onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })}
                      className="w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-sand-900 placeholder:text-sand-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 uppercase tracking-wide mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-coral-500" />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-sand-900 placeholder:text-sand-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 uppercase tracking-wide mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-coral-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="w-full bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-bold text-sand-900 placeholder:text-sand-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <BeachButton
                  type="submit"
                  variant="secondary-coral"
                  size="lg"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                </BeachButton>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-transparent px-3 text-white/60 font-bold uppercase tracking-wide">Ou</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-white/90 hover:bg-white border border-white/30 rounded-2xl px-6 py-3.5 font-black text-sand-900 uppercase text-sm tracking-tight transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Chrome className="w-5 h-5" />
                  Google
                </button>
              </form>
            )}

            {/* Footer Note */}
            <p className="mt-6 text-center text-xs text-white/60 font-medium">
              Bem-vindo à comunidade mais vibrante de Beach Tennis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
