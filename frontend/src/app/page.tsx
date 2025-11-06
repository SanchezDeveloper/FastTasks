"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTasks } from "./store/useTasks";

export default function Home() {
  const { user, tasks, setTasks, setUser } = useTasks();
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (!user.token) return;
    axios.get("https://fasttasks.onrender.com/tasks", {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then((res) => setTasks(res.data));
  }, [user, setTasks]);

  const addTask = async () => {
    const { data } = await axios.post(
      "https://fasttasks.onrender.com/tasks",
      { title: newTask },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setTasks([...tasks, data]);
    setNewTask("");
  };

  const toggleTask = async (id: number) => {
    const { data } = await axios.patch(
      `https://fasttasks.onrender.com/tasks/${id}`,
      {},
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setTasks(tasks.map((t) => (t.id === id ? data : t)));
  };

  const deleteTask = async (id: number) => {
    await axios.delete(`https://fasttasks.onrender.com/tasks/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setTasks(tasks.filter((t) => t.id !== id));
  };

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

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 flex-1 mr-2"
          placeholder="Nova tarefa..."
        />
        <button onClick={addTask} className="bg-green-500 text-white px-4 py-2 rounded">
          +
        </button>
      </div>

      <ul>
        {tasks.map((t) => (
          <li key={t.id} className="flex justify-between items-center mb-2 border-b pb-1">
            <span
              onClick={() => toggleTask(t.id)}
              className={`cursor-pointer ${t.done ? "line-through text-gray-400" : ""}`}
            >
              {t.title}
            </span>
            <button onClick={() => deleteTask(t.id)} className="text-red-500">x</button>
          </li>
        ))}
      </ul>

      <button onClick={() => setUser({ token: null })} className="mt-4 text-sm text-gray-500">
        Sair
      </button>
    </div>
  );
}
