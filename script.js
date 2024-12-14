const pokemonListContainer = document.getElementById("pokemonList");
const pokemonDetailsContainer = document.getElementById("pokemonDetails");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const currentPageDisplay = document.getElementById("currentPage");

let currentPage = 1;
const ITEMS_PER_PAGE = 20;

// Fetch Pokémon list
async function fetchPokemonList(page) {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${ITEMS_PER_PAGE}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data.results)

  renderPokemonList(data.results);
}

// Fetch Pokémon details
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  const data = await response.json();

  renderPokemonDetails(data);
}

// Render Pokémon list
function renderPokemonList(pokemonList) {
  pokemonListContainer.innerHTML = "";
  pokemonList.forEach((pokemon) => {
    const pokemonId = pokemon.url.split("/")[6];
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    card.innerHTML = `
      <p>#Id ${pokemonId}</p>
      <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
    `;
    card.onclick = () => fetchPokemonDetails(pokemon.url);
    pokemonListContainer.appendChild(card);
  });
}

// Render Pokémon details
function renderPokemonDetails(pokemon) {
  pokemonDetailsContainer.innerHTML = `
    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
    <p>ID: ${pokemon.id}</p>
    <p>Type: ${pokemon.types.map((t) => t.type.name)}</p>
    <p>Weight: ${pokemon.weight}kg</p>
    <div class="sprites">
      ${Object.values(pokemon.sprites)
        .filter((sprite) => sprite)
        .map((sprite) => `<img src="${sprite}" alt="sprite">`)
        .join("")}
    </div>
    <p>Moves: ${pokemon.moves.slice(0, 5).map((m) => m.move.name).join(", ")}</p>
  `;
}

// Handle pagination
function handlePagination() {
  prevPageButton.disabled = currentPage === 1;
  currentPageDisplay.textContent = `Página ${currentPage}`;
}

// Event listeners
searchButton.onclick = async () => {
  const query = searchInput.value.toLowerCase();
  if (!query) return;
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${query}`;
    const response = await fetch(url);
    const data = await response.json();

    renderPokemonDetails(data);
  } catch (error) {
    alert("Pokémon no encontrado.");
  }
};

prevPageButton.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    fetchPokemonList(currentPage);
    handlePagination();
  }
};

nextPageButton.onclick = () => {
  currentPage++;
  fetchPokemonList(currentPage);
  handlePagination();
};

// Initialize
fetchPokemonList(currentPage);
handlePagination();
