import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
            setLoading(false);
        } else {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sand to-cream px-6">
            <div className="w-full max-w-md">
                <div className="bg-background border border-gold/20 p-8 md:p-10">
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-2">
                            Administración
                        </h1>
                        <p className="text-xs uppercase tracking-[0.3em] text-gold font-body">
                            Panel de Control
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs uppercase tracking-[0.2em] text-foreground/70 font-body mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-warm-gray/30 bg-background text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors"
                                placeholder="admin@ejemplo.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs uppercase tracking-[0.2em] text-foreground/70 font-body mb-2"
                            >
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-warm-gray/30 bg-background text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray/50 hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-charcoal text-primary-foreground py-4 text-xs uppercase tracking-[0.3em] font-body hover:bg-charcoal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="text-xs uppercase tracking-[0.2em] text-warm-gray hover:text-gold transition-colors font-body"
                        >
                            ← Volver al sitio
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
