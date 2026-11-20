"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { useTodoLists } from "@/components/todo-lists-provider"

const captionClass =
  "text-[11px] font-light tracking-[0.16em] text-foreground/55"

export function SidebarLists() {
  const { lists, ready, toggleTask } = useTodoLists()
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  function toggleExpanded(listId: string) {
    setExpandedIds((current) =>
      current.includes(listId)
        ? current.filter((id) => id !== listId)
        : [...current, listId]
    )
  }

  return (
    <nav
      aria-label="Lists"
      className="flex min-h-0 flex-1 flex-col overflow-x-hidden px-3 pt-6 pb-4"
    >
      <p className={`px-2 pb-2 ${captionClass}`}>Lists</p>
      {ready && lists.length === 0 ? (
        <p className="px-2 text-sm font-light text-foreground/45">No lists yet</p>
      ) : null}
      {ready && lists.length > 0 ? (
        <ul className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
          {lists.map((list) => {
            const expanded = expandedIds.includes(list.id)
            const panelId = `sidebar-list-${list.id}`

            return (
              <li key={list.id}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  title={list.name}
                  onClick={() => toggleExpanded(list.id)}
                  className="flex w-full items-center gap-1.5 rounded-sm px-2 py-2 text-left text-sm font-medium tracking-wide outline-none hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-foreground/25"
                >
                  <ChevronRight
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className={`size-4 shrink-0 text-foreground/55 transition-transform duration-200 ${
                      expanded ? "rotate-90" : ""
                    }`}
                  />
                  <span className="min-w-0 truncate">{list.name}</span>
                </button>
                <ul
                  id={panelId}
                  hidden={!expanded}
                  className={
                    expanded
                      ? "flex flex-col gap-2 py-1 pr-1 pb-2 pl-8"
                      : undefined
                  }
                >
                  {list.tasks.length === 0 ? (
                    <li className="text-sm font-light text-foreground/45">
                      No tasks
                    </li>
                  ) : (
                    list.tasks.map((task) => (
                      <li key={task.id} className="flex items-start gap-2.5">
                        <Checkbox
                          checked={task.done}
                          onCheckedChange={(checked) =>
                            toggleTask(list.id, task.id, checked)
                          }
                          aria-label={
                            task.done
                              ? `Mark "${task.text}" not done`
                              : `Mark "${task.text}" done`
                          }
                          className="mt-0.5"
                        />
                        <span
                          className={`min-w-0 text-sm font-light leading-snug tracking-wide ${
                            task.done ? "text-foreground/40 line-through" : ""
                          }`}
                        >
                          {task.text}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </li>
            )
          })}
        </ul>
      ) : null}
    </nav>
  )
}
