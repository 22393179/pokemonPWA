import { useEffect, useState } from "react";
import PokemonList from "./components/PokemonList";
import FilterButtons from "./components/FilterButtons";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filter, setFilter] = useState("ver-todos");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonsPerPage = 20;

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      const limit = 151;
      const response = await axios.get(`${API_URL}/pokemon?limit=${limit}`);
      const results = await Promise.all(
        response.data.results.map(async (p) => {
          const res = await axios.get(p.url);
          return res.data;
        })
      );
      setPokemons(results);
      setLoading(false);
    };
    fetchPokemons();
  }, []);

  const filteredPokemons =
    filter === "ver-todos"
      ? pokemons
      : pokemons.filter((p) => p.types.some((t) => t.type.name === filter));

  // --- Lógica de paginación ---
  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);
  const startIndex = (currentPage - 1) * pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(
    startIndex,
    startIndex + pokemonsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-10">
      <header className="w-full shadow bg-white mb-6">
        <nav className="max-w-5xl mx-auto py-4 px-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
            alt="Logo Pokédex"
            className="w-40"
          />
          <FilterButtons active={filter} onFilter={setFilter} />
        </nav>
      </header>

      <main className="max-w-5xl w-full px-4">
        {loading ? (
          <p className="text-center text-gray-500">Cargando Pokémon...</p>
        ) : (
          <>
            <PokemonList pokemons={currentPokemons} />

            {/* Controles de paginación */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              >
                ← Anterior
              </button>
              <span className="text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
