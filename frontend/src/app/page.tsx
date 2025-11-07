"use client";
import { useEffect, useState } from "react";
import { useTasks } from "@/store/useTasks";
import { addTask, deleteTask, toggleTask } from "@/lib/taskActions";

export default function Home() {
  const { user, tasks, setTasks, fetchTasks, setUser } = useTasks();
  const [newTask, setNewTask] = useState("");



  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  // Verificação de login
  if (!user.token) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Você precisa logar!</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => (window.location.href = "/login")}
        >
          Ir para Login
        </button>
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
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 flex-1 mr-2"
          placeholder="Nova tarefa..."
        />
        <button onClick={handleAddTask} className="bg-green-500 text-white px-4 py-2 rounded">
          +
        </button>
      </div>

      <ul>
        {tasks.map((t) => (
          <li key={t.id} className="flex justify-between items-center mb-2 border-b pb-1">
            <span
              onClick={() => handleToggleTask(t.id)}
              className={`cursor-pointer ${t.done ? "line-through text-gray-400" : ""}`}
            >
              {t.title}
            </span>
            <button onClick={() => handleDeleteTask(t.id)} className="text-red-500">x</button>
          </li>
        ))}
      </ul>

      <button onClick={() => setUser({ token: null })} className="mt-4 text-sm text-gray-500">
        Sair
      </button>
    </div>
  );
}
