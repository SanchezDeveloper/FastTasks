import { api } from '@/app/lib/api';
import { create } from 'zustand';

interface Task {
  id: number;
  title: string;
  done: boolean;
};

interface User {
  token: string | null;
};

interface TasksState {
  user: User;
  tasks: Task[];
  setUser: (u: User) => void;
  setTasks: (t: Task[]) => void;
  fetchTasks: () => Promise<void>;
}

export const useTasks = create<TasksState>((set, get) => ({
  user: { token: null },
  tasks: [],
  setUser: (user) => set({ user }),
  setTasks: (tasks) => set({ tasks }),

  fetchTasks: async () => {
    const { user } = get();
    if(!user.token) return;

    const { data } = await api.get("/tasks", {
      headers: { Authorization: `Bearer ${user.token}`},
    });
    set({ tasks: data });
  },
}));