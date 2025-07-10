import React, { useEffect, useState, useMemo } from "react"
import Header from "./components/Header"
import SearchFilter from "./components/SearchFilter"
import Stats from "./components/Stats"
import TaskColumn from "./components/TaskColumn"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"

export type Task = {
  id: string
  title: string
  priority: "Low" | "Medium" | "High"
  status: "todo" | "inprogress" | "done"
  order: number
}

const STATUSES: { key: Task["status"]; label: string }[] = [
  { key: "todo", label: "À faire" },
  { key: "inprogress", label: "En cours" },
  { key: "done", label: "Terminé" },
]

const PRIORITIES = ["Low", "Medium", "High"] as const

function App() {
  // État : liste des tâches (récupérée depuis localStorage)
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("taskmate-tasks")
    try {
      const parsed = saved ? JSON.parse(saved) : []
      if (!Array.isArray(parsed)) throw new Error("Invalid data")
      return parsed.map((t: any, i: number) => ({
        ...t,
        order: typeof t.order === "number" ? t.order : i,
      }))
    } catch (err) {
      console.warn("Erreur de parsing localStorage, réinitialisation :", err)
      localStorage.removeItem("taskmate-tasks")
      return []
    }
  })

  // État : champ de recherche
  const [search, setSearch] = useState("")
  // État : filtre par priorité
  const [filterPriority, setFilterPriority] = useState<string | "">("")
  // État : mode sombre
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  )
  // État : indique si un élément est en train d'être déplacé
  const [isDragging, setIsDragging] = useState(false)

  // Sauvegarde des tâches dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("taskmate-tasks", JSON.stringify(tasks))
  }, [tasks])

  // Mise à jour de la classe dark dans html selon l'état
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
  }, [darkMode])

  // Filtrage des tâches selon recherche et priorité (hors drag)
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return []
    if (isDragging) return tasks

    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
      const matchesPriority = filterPriority ? t.priority === filterPriority : true
      return matchesSearch && matchesPriority
    })
  }, [tasks, search, filterPriority, isDragging])

  // Regroupement des tâches par statut
  const tasksByStatus = useMemo(() => {
    const grouped: Record<Task["status"], Task[]> = {
      todo: [],
      inprogress: [],
      done: [],
    }

    if (Array.isArray(filteredTasks)) {
      filteredTasks.forEach((task) => {
        grouped[task.status].push(task)
      })

      // Tri par ordre pour chaque colonne
      const statuses: Task["status"][] = ["todo", "inprogress", "done"]
      statuses.forEach((status) => {
        grouped[status].sort((a, b) => a.order - b.order)
      })
    } else {
      console.warn("filteredTasks n'est pas un tableau :", filteredTasks)
    }

    return grouped
  }, [filteredTasks])

  // Début du glisser-déposer
  const onDragStart = () => setIsDragging(true)

  // Fin du glisser-déposer
  const onDragEnd = (result: DropResult) => {
    setIsDragging(false)
    const { source, destination, draggableId } = result
    if (!destination) return

    setTasks((prev) => {
      const task = prev.find((t) => t.id === draggableId)
      if (!task) return prev

      const updatedTask = { ...task, status: destination.droppableId as Task["status"] }

      const tasksWithoutDragged = prev.filter((t) => t.id !== draggableId)

      const tasksInDestination = tasksWithoutDragged
        .filter((t) => t.status === updatedTask.status)
        .sort((a, b) => a.order - b.order)

      tasksInDestination.splice(destination.index, 0, updatedTask)

      const updatedWithOrder = tasksInDestination.map((t, i) => ({
        ...t,
        order: i,
      }))

      const tasksInOtherColumns = tasksWithoutDragged.filter(
        (t) => t.status !== updatedTask.status
      )

      return [...tasksInOtherColumns, ...updatedWithOrder]
    })
  }

  // Ajout d'une nouvelle tâche
  const addTask = () => {
    const title = prompt("Nouvelle tâche :")?.trim()
    if (!title) return

    const priority = prompt("Priorité (Low, Medium, High) :", "Medium")
    if (priority && !PRIORITIES.includes(priority as any)) {
      alert("Priorité invalide. Valeurs possibles: Low, Medium, High.")
      return
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      priority: (priority as Task["priority"]) || "Medium",
      status: "todo",
      order: Date.now(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  // Mise à jour d'une tâche
  const updateTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }

  // Suppression d'une tâche
  const deleteTask = (id: string) => {
    if (window.confirm("Supprimer cette tâche ?")) {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-7xl mx-auto">
      {/* Composant d'en-tête avec dark mode */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Filtres et bouton d'ajout */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        <SearchFilter
          search={search}
          setSearch={setSearch}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
        />
        <button
          onClick={addTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + Ajouter une tâche
        </button>
      </div>

      {/* Statistiques des tâches */}
      <Stats tasks={tasks} />

      {/* Colonnes de tâches avec drag-and-drop */}
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-6 mt-6 flex-col md:flex-row">
          {STATUSES.map(({ key, label }) => (
            <TaskColumn
              key={key}
              status={key}
              title={label}
              tasks={tasksByStatus[key]}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default App
