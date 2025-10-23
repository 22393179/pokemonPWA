const types = [
  "ver-todos",
  "normal", "fire", "water", "grass", "electric", "ice",
  "fighting", "poison", "ground", "flying", "psychic",
  "bug", "rock", "ghost", "dark", "dragon", "steel", "fairy"
];

export default function FilterButtons({ active, onFilter }) {
  return (
    <ul className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {types.map((type) => (
        <li key={type}>
          <button
            onClick={() => onFilter(type)}
            className={`px-3 py-1 rounded-full font-semibold text-sm capitalize shadow 
              ${active === type ? "bg-red-500 text-white" : "bg-gray-200 hover:scale-105 transition"}`}
          >
            {type === "ver-todos" ? "Ver todos" : type}
          </button>
        </li>
      ))}
    </ul>
  );
}
