import React, { useState, useRef, useEffect } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { Task } from "../App"

type Props = {
  task: Task 
  index: number // Position de la tâche dans la liste
  updateTask: (task: Task) => void 
  deleteTask: (id: string) => void 
}

// Liste des priorités possibles
const PRIORITIES = ["Low", "Medium", "High"]

// Composant TaskCard
export default function TaskCard({ task, index, updateTask, deleteTask }: Props) {
  const [editing, setEditing] = useState(false) 
  const [title, setTitle] = useState(task.title) 
  const [priority, setPriority] = useState(task.priority) 
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus automatique sur le champ input quand on édite
  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  // Fonction pour enregistrer les modifications
  const saveEdit = () => {
    if (title.trim() === "") {
      alert("Le titre ne peut pas être vide")
      return
    }
    updateTask({ ...task, title: title.trim(), priority }) // Mise à jour de la tâche
    setEditing(false) 
  }

  // Vérifie que la tâche a un ID valide
  if (!task?.id || typeof task.id !== "string") {
    console.warn("ID de tâche invalide :", task)
    return null
  }

  return (
    // Composant Draggable pour permettre le déplacement
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef} // Référence pour le drag
          {...provided.draggableProps} 
          {...provided.dragHandleProps} 
          className={`bg-white dark:bg-gray-700 rounded-md p-3 mb-3 cursor-pointer shadow-sm hover:shadow-md transition-shadow ${
            snapshot.isDragging ? "bg-blue-100 dark:bg-blue-600" : ""
          }`}
          onDoubleClick={() => setEditing(true)} // Double-clic pour activer l'édition
        >
          {editing ? (
            // Mode édition activé
            <div className="flex flex-col gap-2">
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit()
                  if (e.key === "Escape") {
                    setEditing(false)
                    setTitle(task.title)
                    setPriority(task.priority)
                  }
                }}
                className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />

              {/* Sélecteur de priorité */}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"])}
                className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Boutons Annuler et Enregistrer */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setEditing(false)
                    setTitle(task.title)
                    setPriority(task.priority)
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={saveEdit}
                  className="text-blue-600 hover:underline"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{task.title}</p>

                {/* Priorité avec couleur selon le niveau */}
                <p
                  className={`text-sm ${
                    task.priority === "High"
                      ? "text-red-600"
                      : task.priority === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  Priorité : {task.priority}
                </p>
              </div>

              {/* Bouton de suppression */}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600 hover:text-red-800 font-bold"
                title="Supprimer la tâche"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
