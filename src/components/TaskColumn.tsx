import React from "react"
import TaskCard from "./TaskCard"
import { Task } from "../App"
import { Droppable } from "@hello-pangea/dnd"

type Props = {
  status: Task["status"] 
  title: string 
  tasks?: Task[] 
  updateTask: (task: Task) => void 
  deleteTask: (id: string) => void
}

export default function TaskColumn({
  status,
  title,
  tasks = [],
  updateTask,
  deleteTask,
}: Props) {
  return (
    // Conteneur de la colonne
    <div className="rounded-md p-4 flex-1 min-w-[280px] max-h-[80vh] overflow-y-auto">
      {/* Titre de la colonne */}
      <h2 className="text-xl font-semibold mb-3">{title}</h2>

      {/* Zone où les tâches peuvent être déposées */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps} // Props nécessaires pour le droppable
            ref={provided.innerRef} // Référence au conteneur droppable
            className={`min-h-[60px] transition-colors ${
              snapshot.isDraggingOver ? "bg-gray-100 dark:bg-gray-800" : ""
            }`} // Change le fond quand on survole avec une tâche
          >
            {/* Affichage des tâches sous forme de cartes */}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}

            {/* Espace réservé pour gérer correctement les déplacements */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
