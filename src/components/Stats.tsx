import React from "react"
import { Task } from "../App"

type Props = {
  tasks: Task[] // Liste des tâches
}

export default function Stats({ tasks }: Props) {
  // Calcul du nombre total de tâches
  const total = tasks.length
  // Nombre de tâches à faire
  const todoCount = tasks.filter((t) => t.status === "todo").length
  // Nombre de tâches en cours
  const inprogressCount = tasks.filter((t) => t.status === "inprogress").length
  // Nombre de tâches terminées
  const doneCount = tasks.filter((t) => t.status === "done").length

  return (
    // Conteneur principal des statistiques
    <div className="flex justify-center gap-8 mt-6">
      {/* Première carte contenant "À faire" et "En cours" */}
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-80">
        <div className="flex justify-between">
          <StatCard label="À faire" value={todoCount} color="text-red-500" />
          <StatCard label="En cours" value={inprogressCount} color="text-yellow-500" />
        </div>
      </div>

      {/* Deuxième carte contenant "Terminé" et "Total" */}
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md shadow-md w-80">
        <div className="flex justify-between">
          <StatCard label="Terminé" value={doneCount} color="text-green-500" />
          <StatCard label="Total" value={total} color="text-gray-700 dark:text-gray-300" />
        </div>
      </div>
    </div>
  )
}

// Composant StatCard pour afficher une statistique individuelle
const StatCard = ({
  label, 
  value, 
  color, 
}: {
  label: string
  value: number
  color: string
}) => (
  <div className="text-center w-32">
    <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    <p className="text-sm">{label}</p>
  </div>
)
