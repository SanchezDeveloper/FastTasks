"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useTasks } from "../store/useTasks";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useTasks();
  const router = useRouter();
  
  const handleSubmit = async () => {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      const url = isRegister ? "/auth/register" : "/auth/login";
      const { data } = await axios.post(
        `https://fasttasks.onrender.com${url}`
        , { username, password}
      );

      if (isRegister) {
        alert("Usuário registrado com sucesso! Faça Login.");
        setIsRegister(false);
        setUsername("");
        setPassword("");
      } else if (data.token) {
        setUser({ token: data.token });
        router.push('/');
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      if (err.response?.status === 401) setError("Credenciais inválidas.");
      else if (err.response?.status === 409)
        setError("Usuário já existe. Tente outro nome.");
      else setError("Erro ao processar requisição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-80 text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {isRegister ? "Criar Conta" : "Entrar"}
        </h1>

        <input
          className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 py-1 rounded">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading
            ? "Carregando..."
            : isRegister
            ? "Registrar"
            : "Entrar"}
        </button>

        <button
          className="mt-4 text-sm text-gray-500 hover:underline"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
        >
          {isRegister
            ? "Já tem conta? Entrar"
            : "Não tem conta? Registrar"}
        </button>
      </div>
    </div>
  );
}