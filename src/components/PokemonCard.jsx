export default function PokemonCard({ pokemon }) {
  const { id, name, types, height, weight, sprites } = pokemon;

  const formattedId = id.toString().padStart(3, "0");
  const mainType = types[0].type.name;

  const typeColor = {
    normal: "bg-yellow-200",
    fire: "bg-red-300",
    water: "bg-blue-300",
    grass: "bg-green-300",
    electric: "bg-yellow-200",
    ice: "bg-cyan-100",
    fighting: "bg-orange-200",
    poison: "bg-purple-300",
    ground: "bg-amber-200",
    flying: "bg-indigo-200",
    psychic: "bg-pink-200",
    bug: "bg-lime-300",
    rock: "bg-stone-200",
    ghost: "bg-violet-200",
    dark: "bg-gray-300",
    dragon: "bg-indigo-300",
    steel: "bg-zinc-200",
    fairy: "bg-rose-200",
  };

  return (
    <div
      className={`rounded-xl p-4 shadow-md text-center relative overflow-hidden ${typeColor[mainType] || "bg-gray-100"}`}
    >
      <p className="absolute top-2 left-1/2 -translate-x-1/2 text-6xl font-extrabold text-gray-200 select-none">
        #{formattedId}
      </p>

      <div className="flex justify-center">
        <img
          src={sprites.other["official-artwork"].front_default}
          alt={name}
          className="w-28 h-28 z-10"
        />
      </div>

      <h2 className="text-lg font-bold capitalize mt-2 z-10">{name}</h2>

      <div className="flex justify-center flex-wrap gap-2 mt-2">
        {types.map((t) => (
          <span
            key={t.type.name}
            className="text-xs px-2 py-1 rounded-full bg-white/70 capitalize"
          >
            {t.type.name}
          </span>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-3 text-sm text-gray-700">
        <p className="bg-white/70 px-2 py-1 rounded-full">{height} m</p>
        <p className="bg-white/70 px-2 py-1 rounded-full">{weight} kg</p>
      </div>
    </div>
  );
}
