"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTasks } from "../store/useTasks";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useTasks();
  const router = useRouter();
  
  const handleSubmit = async () => {
    const url = isRegister ? "/auth/register" : "/auth/login";

    const { data } = await axios.post(`https://fasttasks.onrender.com${url}`, { username, password});
    if (data.token) {
      setUser({ token: data.token });
      router.push("/");
    } else alert ("Registrado! Faça login.");
  };

  return ( 
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">{isRegister ? "Registrar" : "Login"}</h1>
      <input className="border p-2 mb-2" placeholder="Usuário" onChange={(e) => setUsername(e.target.value)}/>
      <input className="border p-2 mb-2" placeholder="Senha" onChange={(e) => setPassword(e.target.value)}/>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
        {isRegister? "Registrar" : "Entrar"}
      </button>
      <button className="mt-2 text-sm text-gray-500" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Registrar" : "Entrar"}
      </button>
    </div>
  );
}