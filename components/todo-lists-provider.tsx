"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  readTodoLists,
  writeTodoLists,
  type TodoList,
  type TodoTask,
} from "@/lib/todo-lists"

interface TodoListsValue {
  lists: TodoList[]
  ready: boolean
  addList: (name: string, tasks: TodoTask[]) => void
  addTask: (listId: string, text: string) => void
  toggleTask: (listId: string, taskId: string, done: boolean) => void
  updateList: (listId: string, name: string, tasks: TodoTask[]) => void
  deleteList: (listId: string) => void
}

const TodoListsContext = createContext<TodoListsValue | null>(null)

function createTask(text: string): TodoTask {
  return { id: crypto.randomUUID(), text, done: false }
}

export function TodoListsProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<TodoList[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLists(readTodoLists())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    writeTodoLists(lists)
  }, [lists, ready])

  const addList = useCallback((name: string, tasks: TodoTask[]) => {
    setLists((current) => [
      { id: crypto.randomUUID(), name, tasks },
      ...current,
    ])
  }, [])

  const addTask = useCallback((listId: string, text: string) => {
    setLists((current) =>
      current.map((list) =>
        list.id === listId
          ? { ...list, tasks: [...list.tasks, createTask(text)] }
          : list
      )
    )
  }, [])

  const toggleTask = useCallback(
    (listId: string, taskId: string, done: boolean) => {
      setLists((current) =>
        current.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: list.tasks.map((task) =>
                  task.id === taskId ? { ...task, done } : task
                ),
              }
            : list
        )
      )
    },
    []
  )

  const updateList = useCallback(
    (listId: string, name: string, tasks: TodoTask[]) => {
      setLists((current) =>
        current.map((list) =>
          list.id === listId ? { ...list, name, tasks } : list
        )
      )
    },
    []
  )

  const deleteList = useCallback((listId: string) => {
    setLists((current) => current.filter((list) => list.id !== listId))
  }, [])

  const value = useMemo(
    () => ({
      lists,
      ready,
      addList,
      addTask,
      toggleTask,
      updateList,
      deleteList,
    }),
    [lists, ready, addList, addTask, toggleTask, updateList, deleteList]
  )

  return (
    <TodoListsContext.Provider value={value}>{children}</TodoListsContext.Provider>
  )
}

export function useTodoLists(): TodoListsValue {
  const value = useContext(TodoListsContext)

  if (!value) {
    throw new Error("useTodoLists must be used within TodoListsProvider")
  }

  return value
}
