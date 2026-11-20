export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export type UpdateTaskInput = Partial<
  Pick<Task, "title" | "description" | "completed">
>;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot reach the API at ${apiUrl}. Make sure the NestJS server is running.`,
    );
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message;

    throw new Error(
      message || `API request failed with status ${response.status}.`,
    );
  }

  return (await response.json()) as T;
}

export function getTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks");
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  return request<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTask(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/tasks/${id}`, {
    method: "DELETE",
  });
}
