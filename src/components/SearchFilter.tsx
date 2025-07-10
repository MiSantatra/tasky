import React from "react" 

type Props = {
  search: string // Valeur de la recherche
  setSearch: React.Dispatch<React.SetStateAction<string>> // Fonction pour mettre à jour la recherche
  filterPriority: string | "" // Filtre de priorité sélectionné
  setFilterPriority: React.Dispatch<React.SetStateAction<string | "">> // Fonction pour mettre à jour le filtre
}

// Liste des priorités possibles
const PRIORITIES = ["", "Low", "Medium", "High"]

// Composant SearchFilter
export default function SearchFilter({
  search,
  setSearch,
  filterPriority,
  setFilterPriority,
}: Props) {
  return (
    // Conteneur principal avec un espacement entre les éléments
    <div className="flex gap-4 items-center flex-wrap ">
      {/* Champ de saisie pour la recherche */}
      <input
        type="text"
        placeholder="Recherche..."
        value={search} // Valeur actuelle de la recherche
        onChange={(e) => setSearch(e.target.value)} // Mise à jour de la recherche lors de la saisie
        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />

      {/* Menu déroulant pour filtrer par priorité */}
      <select
        value={filterPriority} // Priorité actuellement sélectionnée
        onChange={(e) => setFilterPriority(e.target.value)} // Mise à jour du filtre lorsqu'une option est sélectionnée
        className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        {/* Boucle sur les priorités pour générer les options */}
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {/* Affiche "Toutes priorités" si la valeur est vide, sinon affiche la priorité */}
            {p === "" ? "Toutes priorités" : p}
          </option>
        ))}
      </select>
    </div>
  )
}
