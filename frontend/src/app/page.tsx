"use client";
import { useEffect, useState } from "react";
import { useTasks } from "@/app/store/useTasks";
import { addTask, deleteTask, toggleTask } from "@/app/lib/taskActions";

export default function Home() {
  const { user, tasks, setTasks, fetchTasks, setUser } = useTasks();
  const [newTask, setNewTask] = useState("");



  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  // Verificação de login
  if (!user.token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-sm w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Acesso restrito 🔒
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para ver suas tarefas.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            onClick={() => (window.location.href = "/login")}
          >
            Ir para o Login
          </button>
        </div>
      </div>
    );
  }


  //funções para tasks
  const handleAddTask = async () => {
     if (!user.token) return;
    const data = await addTask(newTask, user.token);
    setTasks([...tasks, data]);
    setNewTask("");
  };

  const handleToggleTask = async ( id: number ) => {
     if (!user.token) return;
    const data = await toggleTask(id, user.token);
    setTasks(tasks.map((t) => (t.id === id ? data : t)));
  };

  const handleDeleteTask = async (id: number) => { 
     if (!user.token) return;
    await deleteTask(id, user.token);
    setTasks(tasks.filter((t) => t.id !== id));
  };
  


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        {/* Header / Input */}
        <div className="flex items-center gap-2 mb-6">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Adicionar nova tarefa..."
          />
          <button
            onClick={handleAddTask}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition-colors"
          >
            +
          </button>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 italic">Nenhuma tarefa por enquanto 💤</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex justify-between items-center border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
              >
                <span
                  onClick={() => handleToggleTask(t.id)}
                  className={`cursor-pointer text-base ${
                    t.done ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {t.title}
                </span>
                <button
                  onClick={() => handleDeleteTask(t.id)}
                  className="text-red-500 hover:text-red-600 font-bold text-lg"
                  title="Excluir"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Logout */}
        <button
          onClick={() => setUser({ token: null })}
          className="w-full mt-6 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
}
