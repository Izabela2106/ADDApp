"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"
import { useEffect, useId, useRef, useState, type FormEvent } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useTodoLists } from "@/components/todo-lists-provider"
import { type TodoList, type TodoTask } from "@/lib/todo-lists"

const outlineButtonClass =
  "inline-flex size-11 items-center justify-center rounded-full border-[1.5px] border-current bg-transparent text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"

const smallOutlineButtonClass =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-current bg-transparent text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"

const iconButtonClass =
  "inline-flex size-9 items-center justify-center rounded-full border-[1.5px] border-current bg-transparent text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"

const textButtonClass =
  "inline-flex h-11 items-center justify-center rounded-full border-[1.5px] border-current bg-transparent text-sm font-light tracking-wide text-foreground transition-colors outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"

const nameInputClass =
  "h-auto rounded-none border-0 border-b-[1.5px] border-foreground/25 bg-transparent px-0 text-base font-light shadow-none focus-visible:border-foreground focus-visible:ring-0 md:text-base"

const captionClass =
  "text-[11px] font-light tracking-[0.16em] text-foreground/55"

const dialogContentClass =
  "gap-0 rounded-sm bg-card p-0 text-foreground shadow-[0_18px_50px_rgba(0,0,0,0.08)] ring-0 sm:max-w-md [&_[data-slot=dialog-close]]:top-3.5 [&_[data-slot=dialog-close]]:right-3.5 [&_[data-slot=dialog-close]]:size-9 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:border-[1.5px] [&_[data-slot=dialog-close]]:border-current [&_[data-slot=dialog-close]]:bg-transparent [&_[data-slot=dialog-close]]:text-foreground [&_[data-slot=dialog-close]]:shadow-none [&_[data-slot=dialog-close]]:hover:bg-foreground/5"

function createTask(text: string): TodoTask {
  return { id: crypto.randomUUID(), text, done: false }
}

function TaskComposer({
  id,
  value,
  onChange,
  onAdd,
  submitWithForm = false,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  onAdd?: () => void
  submitWithForm?: boolean
}) {
  return (
    <div className="flex items-end gap-3">
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter" || submitWithForm) return
          event.preventDefault()
          onAdd?.()
        }}
        placeholder="Add a task"
        autoComplete="off"
        className={nameInputClass}
      />
      <button
        type={submitWithForm ? "submit" : "button"}
        aria-label="Add task"
        onClick={
          submitWithForm
            ? undefined
            : () => {
                onAdd?.()
              }
        }
        className={smallOutlineButtonClass}
      >
        <Plus strokeWidth={1.5} className="size-4" />
      </button>
    </div>
  )
}

function EditListDialog({
  list,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: {
  list: TodoList
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (listId: string, name: string, tasks: TodoTask[]) => void
  onDelete: (listId: string) => void
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [title, setTitle] = useState(list.name)
  const [tasks, setTasks] = useState(list.tasks)
  const [taskDraft, setTaskDraft] = useState("")
  const titleId = useId()
  const taskId = useId()
  const listRef = useRef(list)
  listRef.current = list

  useEffect(() => {
    if (!open) return
    const current = listRef.current
    setConfirmOpen(false)
    setTitle(current.name)
    setTasks(current.tasks.map((task) => ({ ...task })))
    setTaskDraft("")
  }, [open])

  function handleOpenChange(next: boolean) {
    if (!next && confirmOpen) {
      setConfirmOpen(false)
      return
    }

    onOpenChange(next)
    if (!next) setConfirmOpen(false)
  }

  function addDraftTask() {
    const trimmed = taskDraft.trim()
    if (!trimmed) return
    setTasks((current) => [...current, createTask(trimmed)])
    setTaskDraft("")
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const pending = taskDraft.trim()
    const nextTasks = tasks.flatMap((task) => {
      const text = task.text.trim()
      return text ? [{ ...task, text }] : []
    })
    if (pending) nextTasks.push(createTask(pending))

    onSave(list.id, trimmedTitle, nextTasks)
    onOpenChange(false)
  }

  function handleDelete() {
    onDelete(list.id)
    setConfirmOpen(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={dialogContentClass}>
        <button
          type="button"
          aria-label={`Delete ${list.name}`}
          onClick={() => setConfirmOpen(true)}
          className={`${iconButtonClass} absolute top-3.5 left-3.5 z-10`}
        >
          <Trash2 strokeWidth={1.5} className="size-4" />
        </button>
        <DialogHeader className="items-center px-14 pt-6 pb-1">
          <DialogTitle className={captionClass}>Edit list</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSave}
          className="flex flex-col gap-6 px-8 pt-4 pb-8"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor={titleId} className={captionClass}>
              Title
            </label>
            <Input
              id={titleId}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              autoFocus
              autoComplete="off"
              className={nameInputClass}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor={taskId} className={captionClass}>
              Tasks
            </label>
            {tasks.length > 0 ? (
              <ul className="flex max-h-40 flex-col gap-2.5 overflow-y-auto">
                {tasks.map((task) => (
                  <li key={task.id} className="flex flex-nowrap items-center gap-3">
                    <label className="flex min-w-0 flex-1 flex-nowrap items-center gap-3">
                      <Checkbox
                        checked={task.done}
                        onCheckedChange={(checked) =>
                          setTasks((current) =>
                            current.map((item) =>
                              item.id === task.id
                                ? { ...item, done: checked }
                                : item
                            )
                          )
                        }
                        aria-label={
                          task.done
                            ? `Mark "${task.text}" not done`
                            : `Mark "${task.text}" done`
                        }
                        className="shrink-0"
                      />
                      <span
                        className={`min-w-0 flex-1 truncate text-sm font-light tracking-wide ${
                          task.done ? "text-foreground/40 line-through" : ""
                        }`}
                      >
                        {task.text}
                      </span>
                    </label>
                    <button
                      type="button"
                      aria-label={`Remove "${task.text}"`}
                      onClick={() =>
                        setTasks((current) =>
                          current.filter((item) => item.id !== task.id)
                        )
                      }
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-foreground/55 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/25"
                    >
                      <X strokeWidth={1.5} className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <TaskComposer
              id={taskId}
              value={taskDraft}
              onChange={setTaskDraft}
              onAdd={addDraftTask}
            />
          </div>
          <button type="submit" className={textButtonClass}>
            Save
          </button>
        </form>
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className={`${dialogContentClass} z-[60]`}>
            <DialogHeader className="items-center px-8 pt-6 pb-1">
              <DialogTitle className={captionClass}>Delete list</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6 px-8 pt-4 pb-8">
              <p className="text-center text-sm font-light leading-relaxed text-foreground/70">
                Delete &ldquo;{list.name}&rdquo;? Its tasks will be removed too.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className={textButtonClass}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`${textButtonClass} border-destructive text-destructive`}
                >
                  Delete
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}

function ListCard({
  list,
  onAddTask,
  onToggleTask,
  onUpdate,
  onDelete,
}: {
  list: TodoList
  onAddTask: (listId: string, text: string) => void
  onToggleTask: (listId: string, taskId: string, done: boolean) => void
  onUpdate: (listId: string, name: string, tasks: TodoTask[]) => void
  onDelete: (listId: string) => void
}) {
  const [draft, setDraft] = useState("")
  const [editOpen, setEditOpen] = useState(false)
  const taskId = useId()

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onAddTask(list.id, trimmed)
    setDraft("")
  }

  const visibleTasks = list.tasks.slice(0, 3)
  const hiddenTaskCount = list.tasks.length - visibleTasks.length

  return (
    <li className="relative flex h-full flex-col gap-4 rounded-sm bg-card px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
      <h2 className="truncate pr-10 text-sm font-medium tracking-wide">
        {list.name}
      </h2>
      <button
        type="button"
        aria-label={`Edit ${list.name}`}
        onClick={() => setEditOpen(true)}
        className={`${iconButtonClass} absolute top-3 right-3`}
      >
        <Pencil strokeWidth={1.5} className="size-4" />
      </button>
      <EditListDialog
        list={list}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onUpdate}
        onDelete={onDelete}
      />
      {visibleTasks.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {visibleTasks.map((task) => (
            <li key={task.id}>
              <label className="flex min-w-0 flex-nowrap items-center gap-3">
                <Checkbox
                  checked={task.done}
                  onCheckedChange={(checked) =>
                    onToggleTask(list.id, task.id, checked)
                  }
                  aria-label={
                    task.done
                      ? `Mark "${task.text}" not done`
                      : `Mark "${task.text}" done`
                  }
                  className="shrink-0"
                />
                <span
                  className={`min-w-0 flex-1 truncate text-sm font-light tracking-wide ${
                    task.done ? "text-foreground/40 line-through" : ""
                  }`}
                >
                  {task.text}
                </span>
              </label>
            </li>
          ))}
          {hiddenTaskCount > 0 ? (
            <li className="pl-7 text-sm font-light tracking-[0.2em] text-foreground/45">
              <span aria-hidden="true">...</span>
              <span className="sr-only">{hiddenTaskCount} more tasks</span>
            </li>
          ) : null}
        </ul>
      ) : null}
      <form onSubmit={handleAdd} className="mt-auto">
        <label htmlFor={taskId} className="sr-only">
          Add a task to {list.name}
        </label>
        <TaskComposer id={taskId} value={draft} onChange={setDraft} submitWithForm />
      </form>
    </li>
  )
}

export function TodoLists() {
  const { lists, addList, addTask, toggleTask, updateList, deleteList } =
    useTodoLists()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [taskDraft, setTaskDraft] = useState("")
  const [draftTasks, setDraftTasks] = useState<TodoTask[]>([])
  const titleId = useId()
  const taskId = useId()

  function resetDraft() {
    setTitle("")
    setTaskDraft("")
    setDraftTasks([])
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) resetDraft()
  }

  function addDraftTask() {
    const trimmed = taskDraft.trim()
    if (!trimmed) return
    setDraftTasks((current) => [...current, createTask(trimmed)])
    setTaskDraft("")
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const pending = taskDraft.trim()
    const tasks = pending
      ? [...draftTasks, createTask(pending)]
      : draftTasks

    addList(trimmedTitle, tasks)
    resetDraft()
    setOpen(false)
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-sm font-medium tracking-tight">Lists</h1>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger
            render={
              <button
                type="button"
                aria-label="New list"
                className={outlineButtonClass}
              />
            }
          >
            <Plus strokeWidth={1.5} className="size-5" />
          </DialogTrigger>
          <DialogContent className={dialogContentClass}>
            <DialogHeader className="items-center px-8 pt-6 pb-1">
              <DialogTitle className={captionClass}>New list</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleCreate}
              className="flex flex-col gap-6 px-8 pt-4 pb-8"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor={titleId} className={captionClass}>
                  Title
                </label>
                <Input
                  id={titleId}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  autoFocus
                  autoComplete="off"
                  className={nameInputClass}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor={taskId} className={captionClass}>
                  Tasks
                </label>
                {draftTasks.length > 0 ? (
                  <ul className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                    {draftTasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex items-center justify-between gap-3 text-sm font-light tracking-wide"
                      >
                        <span className="min-w-0 truncate">{task.text}</span>
                        <button
                          type="button"
                          aria-label={`Remove "${task.text}"`}
                          onClick={() =>
                            setDraftTasks((current) =>
                              current.filter((item) => item.id !== task.id)
                            )
                          }
                          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-foreground/55 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/25"
                        >
                          <X strokeWidth={1.5} className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <TaskComposer
                  id={taskId}
                  value={taskDraft}
                  onChange={setTaskDraft}
                  onAdd={addDraftTask}
                />
              </div>
              <button type="submit" className={textButtonClass}>
                Create list
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {lists.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onUpdate={updateList}
              onDelete={deleteList}
            />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
