export interface TodoTask {
  id: string
  text: string
  done: boolean
}

export interface TodoList {
  id: string
  name: string
  tasks: TodoTask[]
}

const STORAGE_KEY = "adhd-timer.todo-lists"

function isTodoTask(value: unknown): value is TodoTask {
  if (!value || typeof value !== "object") return false
  const task = value as Partial<TodoTask>
  return (
    typeof task.id === "string" &&
    typeof task.text === "string" &&
    task.text.trim().length > 0 &&
    typeof task.done === "boolean"
  )
}

function normalizeTodoList(value: unknown): TodoList | null {
  if (!value || typeof value !== "object") return null
  const list = value as Partial<TodoList>
  if (
    typeof list.id !== "string" ||
    typeof list.name !== "string" ||
    list.name.trim().length === 0
  ) {
    return null
  }

  const tasks = Array.isArray(list.tasks) ? list.tasks.filter(isTodoTask) : []
  return { id: list.id, name: list.name, tasks }
}

export function readTodoLists(): TodoList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item) => {
      const list = normalizeTodoList(item)
      return list ? [list] : []
    })
  } catch {
    return []
  }
}

export function writeTodoLists(lists: TodoList[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}
