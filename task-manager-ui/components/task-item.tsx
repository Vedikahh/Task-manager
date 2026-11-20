"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import type { Task } from "@/lib/api";

interface TaskItemProps {
  task: Task;
  disabled: boolean;
  onToggle: () => void;
  onEdit: (title: string) => Promise<boolean>;
  onDelete: () => void;
}

export function TaskItem({
  task,
  disabled,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  async function save() {
    if (await onEdit(title)) setEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void save();
    } else if (event.key === "Escape") {
      setTitle(task.title);
      setEditing(false);
    }
  }

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          disabled={disabled}
          onChange={onToggle}
          aria-label={`Mark ${task.title} as ${task.completed ? "active" : "completed"}`}
          className="mt-1 size-4 shrink-0 accent-indigo-600 disabled:cursor-not-allowed"
        />
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              autoFocus
              value={title}
              disabled={disabled}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Edit task title"
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          ) : (
            <p
              className={`break-words font-medium ${
                task.completed
                  ? "text-slate-500 line-through dark:text-slate-400"
                  : "text-slate-900 dark:text-slate-100"
              }`}
            >
              {task.title}
            </p>
          )}
          {task.description && (
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600 dark:text-slate-400">
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 pl-7 sm:pl-0">
        {editing ? (
          <>
            <button
              type="button"
              disabled={disabled}
              onClick={() => void save()}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-300 dark:hover:bg-indigo-950"
            >
              Save
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setTitle(task.title);
                setEditing(false);
              }}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setTitle(task.title);
                setEditing(true);
              }}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={onDelete}
              className="rounded-md px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-300 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}
