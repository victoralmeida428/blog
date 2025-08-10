'use client'; // Marca este como um Componente de Cliente para usar hooks

import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';

export default function LoginPage() {
    // Hooks de estado para gerir os campos do formulário e mensagens de erro
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    // Função para lidar com a submissão do formulário
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Impede o recarregamento da página
        setIsLoading(true);
        setError(null);

        try {
            console.log(JSON.stringify({username, password}));
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (!response.ok) {
                // Se a resposta não for bem-sucedida, lê a mensagem de erro
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao fazer login');
            }

            // Se o login for bem-sucedido, redireciona para o dashboard ou página principal
            router.push('/'); // Altere para a sua rota protegida

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    Bem-vindo de Volta
                </h1>
                <p className="text-center text-gray-600">
                    Faça login para continuar
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="text-sm font-medium text-gray-700"
                        >
                            Nome de Utilizador
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 text-gray-700 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="seu.utilizador"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            Palavra-passe
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="********"
                        />
                    </div>

                    {/* Exibe a mensagem de erro, se houver */}
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {isLoading ? 'A entrar...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
