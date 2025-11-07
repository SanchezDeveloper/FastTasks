import { api } from "./api";

export const addTask = async (title: string, token: string) => {
  const { data } = await api.post(
    "/tasks",
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const toggleTask = async (id: number, token: string) => {
  const { data } = await api.patch(
    `/tasks/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const deleteTask = async (id: number, token: string) => {
  await api.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
