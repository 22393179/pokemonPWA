import { useEffect, useState } from "react";
import PokemonList from "./components/PokemonList";
import FilterButtons from "./components/FilterButtons";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function solicitarPermisoNotificaciones() {
  if ("Notification" in window) {
    Notification.requestPermission().then((resultado) => {
      console.log("Permiso de notificación:", resultado);
    });
  }
}

async function enviarNotificacion(pokemon) {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.active.postMessage({
      type: "SHOW_NOTIFICATION",
      options: {
        title: `Pokémon consultado: ${pokemon.name}`,
        body: `Has consultado a ${pokemon.name}`,
        icon: pokemon.sprites?.other["official-artwork"].front_default || "/icons/icon-192x192.png",
        vibrate: [200, 100, 200],
        tag: "poke-notify",
      },
    });
  }
}

export default function App() {
      const [pokemons, setPokemons] = useState([]);
      const [filter, setFilter] = useState("ver-todos");
      const [loading, setLoading] = useState(true);
      const [currentPage, setCurrentPage] = useState(1);
      const pokemonsPerPage = 20;
      const [selectedPokemon, setSelectedPokemon] = useState(null);

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
                {/* Botón para activar notificaciones */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={solicitarPermisoNotificaciones}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Activar notificaciones
                  </button>
                </div>

                <PokemonList
                  pokemons={currentPokemons}
                  onSelect={(pokemon) => {
                    setSelectedPokemon(pokemon);
                    enviarNotificacion(pokemon);
                  }}
                />

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

          {selectedPokemon && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-2xl p-6 w-96 max-h-[90vh] overflow-y-auto shadow-xl relative">
                <button
                  onClick={() => setSelectedPokemon(null)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                >
                  ✕
                </button>

                <div className="flex flex-col items-center">
                  <img
                    src={
                      selectedPokemon.sprites.other["official-artwork"]
                        .front_default
                    }
                    alt={selectedPokemon.name}
                    className="w-40 h-40 mb-4"
                  />
                  <h2 className="text-2xl font-bold capitalize mb-2">
                    {selectedPokemon.name}
                  </h2>

                  {/* Tipos */}
                  <div className="flex gap-2 mb-4">
                    {selectedPokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className="text-sm px-3 py-1 rounded-full bg-gray-100 capitalize"
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>

                  {/* Altura y peso */}
                  <div className="flex justify-center gap-4 text-sm text-gray-700 mb-4">
                    <p className="bg-gray-100 px-3 py-1 rounded-full">
                      Altura: {selectedPokemon.height} m
                    </p>
                    <p className="bg-gray-100 px-3 py-1 rounded-full">
                      Peso: {selectedPokemon.weight} kg
                    </p>
                  </div>

                  {/* Habilidades */}
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold mb-2">Habilidades</h3>
                    <ul>
                      {selectedPokemon.abilities.map((a, i) => (
                        <li key={i} className="capitalize">
                          {a.ability.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Estadísticas base */}
                  <div className="w-full mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-center">
                      Estadísticas Base
                    </h3>
                    {selectedPokemon.stats.map((s, i) => (
                      <div key={i} className="mb-2">
                        <p className="flex justify-between text-sm capitalize">
                          <span>{s.stat.name}</span>
                          <span className="font-semibold">{s.base_stat}</span>
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(s.base_stat / 200) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
