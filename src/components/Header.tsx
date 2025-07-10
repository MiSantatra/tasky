import React from "react"

type Props = {
  darkMode: boolean
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>> // Fonction pour changer le mode sombre
}

export default function Header({ darkMode, setDarkMode }: Props) {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-3xl font-bold select-none">Tasky</h1>

      <button
        aria-label="Toggle Dark Mode" 
        onClick={() => setDarkMode((v) => !v)} // Inverse l'état actuel de darkMode
        className="rounded p-2 bg-gray-200 dark:bg-gray-700" 
        title={darkMode ? "Désactiver le mode sombre" : "Activer le mode sombre"}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>
  )
}
