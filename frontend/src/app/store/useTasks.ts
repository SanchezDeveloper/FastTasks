import { create } from 'zustand';

interface Task {
  id: number;
  title: string;
  done: boolean;
};

interface User {
  token: string | null;
};

interface State {
  user: User;
  tasks: Task[];
  setUser: (u: User) => void;
  setTasks: (t: Task[]) => void;
}

export const useTasks = create<State>((set) => ({
  user: { token: null },
  tasks: [],
  setUser: (user) => set({ user }),
  setTasks: (tasks) => set({ tasks }),
}));