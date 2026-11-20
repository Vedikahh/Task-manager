"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import type { Task } from "@/lib/api";
import { TaskItem } from "@/components/task-item";

type Filter = "All" | "Active" | "Completed";

const filters: Filter[] = ["All", "Active", "Completed"];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((requestError: unknown) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  const completedCount = tasks.filter((task) => task.completed).length;
  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === "Active") return !task.completed;
        if (filter === "Completed") return task.completed;
        return true;
      }),
    [filter, tasks],
  );

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const task = await createTask({ title, description });
      setTasks((current) => [...current, task]);
      setTitle("");
      setDescription("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  async function handleToggle(task: Task) {
    await runRequest(task.id, () =>
      updateTask(task.id, { completed: !task.completed }),
    );
  }

  async function handleEdit(task: Task, nextTitle: string) {
    return runRequest(task.id, () => updateTask(task.id, { title: nextTitle }));
  }

  async function handleDelete(task: Task) {
    await runRequest(task.id, () => deleteTask(task.id));
  }

  async function runRequest(
    taskId: number,
    request: () => Promise<Task | { message: string }>,
  ): Promise<boolean> {
    setBusy(true);
    setError(null);

    try {
      const updated = await request();
      if ("id" in updated) {
        setTasks((current) =>
          current.map((task) => (task.id === updated.id ? updated : task)),
        );
      } else {
        setTasks((current) => current.filter((task) => task.id !== taskId));
      }
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Stay on top of it
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Task Manager
          </h1>
        </div>
        <p className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {tasks.length} total · {completedCount} completed
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="shrink-0 rounded px-2 font-semibold hover:bg-red-100 dark:hover:bg-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Add a task</h2>
        <form noValidate onSubmit={handleAdd} className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Title <span className="text-red-600">*</span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs to get done?"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-400"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Description{" "}
            <span className="font-normal text-slate-500">(optional)</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a few details..."
              rows={2}
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-400"
            />
          </label>
          <div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add task
            </button>
          </div>
        </form>
      </section>

      <section aria-label="Tasks">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Your tasks</h2>
          <div
            role="tablist"
            aria-label="Filter tasks"
            className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
          >
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={filter === item}
                disabled={busy}
                onClick={() => setFilter(item)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  filter === item
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Loading tasks...
          </p>
        ) : visibleTasks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No tasks yet
          </p>
        ) : (
          <ul className="grid gap-3">
            {visibleTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                disabled={busy}
                onToggle={() => handleToggle(task)}
                onEdit={(nextTitle) => handleEdit(task, nextTitle)}
                onDelete={() => handleDelete(task)}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}
