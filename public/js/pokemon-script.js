const capitalizeString = (stringVal) => stringVal.split('').map((val, i) => i == 0 ? val.toUpperCase() : val).join('')
const removeSpaces = (stringVal) => stringVal != ''

const formatName = (name) => ({
  toString() {
    return name
  },
  toNormalizedString(options = {}) {
    const {
      replaceChar,
      capitalizeName
    } = Object.assign({ replaceChar: '-', capitalizeName: true }, options)
    return name.split(replaceChar).filter(removeSpaces).map(val => capitalizeName ? capitalizeString(val) : val).join(' ')
  }
})

const chooseRandomItem = (itemsArray) => itemsArray[~~(itemsArray.length * Math.random())];



const fetchApi = (resource, resourceData, token = false) => fetch(`../api/${resource}/${resourceData}`, {
  headers: {
    'Authorization': token ? `Bearer ${retrieveUserToken()}` : '',
  }
})

// =====================================================================================================================

const api = {
  async getPokemon(pokemonId) {
    return fetchApi('pokemons', pokemonId).then(checkResponseCode)
  },
  async getPokemonRegions(regionData) {
    return fetchApi('regions', regionData).then(checkResponseCode)
  },
  async getPokemonLocations(locationData) {
    return fetchApi('locations', locationData).then(checkResponseCode)
  },
  async getPokemonAreas(areaData) {
    return fetchApi('areas', areaData).then(checkResponseCode)
  },
  async getUser(userData) {
    return fetchApi('users', userData, true).then(checkResponseCode)
  }
}

const checkResponseCode = (response) => {
  if (!response.ok) throw new Error('A requisição falhou');

  return response.json();
}

// =====================================================================================================================

const userNameElement = document.getElementById("userName")
const pokemonTableElement = document.getElementById("myTable")
const pokemonInfoElement = document.getElementById("pokeinfo")

window.onload = onLoadFunctions();

function onLoadFunctions() {
  handleUserName(retrieveUserData().name);
  handlePokeTable(retrieveUserData().name);
}

// =====================================================================================================================

function handleUserName() {
  buildUserNameHTML(retrieveUserData())
}

function handlePokemonData(pokemonId) {
  api
    .getPokemon(pokemonId)
    .then(buildPokemonDataHTML)
    .catch(buildHTMLElementErrorHandler(pokemonInfoElement));
}

function handlePokeTable(user = null) {
  const userFetch = user ? `${user}/seen` : "test/seen";
  
  api
    .getUser(userFetch)
    .then(buildPokemonTableDataHTML)
    .catch(buildHTMLElementErrorHandler(pokemonTableElement));
}
function favoritePokemon(pokemon) {
  console.log(pokemon)
}

function catchFromRegion(region) {
  api.getPokemonRegions(region)
    .then(data => {
      return api.getPokemonLocations(chooseRandomItem(data.locations).name)
    }).then(location => {
      var temp = chooseRandomItem(location.areas)

      return api.getPokemonAreas(temp.name)
    }).then(area => {
      pokemon = chooseRandomItem(area.pokemon_encounters).pokemon.name;
      api.getPokemon(pokemon).then(pokeData => {
        Swal.fire({
          title: `<strong>Achou ${pokeData.name}</strong>`,
          icon: `info`,
          html:
            `Local: ${area.name} em ${area.location.name}` +
            `<img src="${pokeData.sprites.front_default}"></img>`,
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText:
            `<i class="fa fa-thumbs-up">Capturar</i>`,
          confirmButtonAriaLabel: 'Thumbs up, great!',
          cancelButtonText:
            '<i class="fa fa-thumbs-down">Fugir</i>',
          cancelButtonAriaLabel: 'Thumbs down'
        }).then((result) => {catchPokemon(pokeData.id, area.location.name, area.name)})
      })
      
    });
}

function catchPokemon(pokemon, location, area) {
  const user = retrieveUserData()
  fetch(`../api/users/${user.id}/catch`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': true ? `Bearer ${retrieveUserToken()}` : '',
    },
    body: JSON.stringify({
      pokemon,
      location,
      area
    })
  }).then(checkResponseCode).then(handlePokeTable(retrieveUserData().name))
}

// =====================================================================================================================

function buildHTMLElementErrorHandler(element) {
  return (err) => {
    element.innerHTML = err.message
  }
}

function buildUserNameHTML(userData) {
  userNameElement.innerHTML = userData.name;
}

function clearHTMLElementContent(element) {
  element.innerHTML = ''
}

function buildPokemonDataHTML(pokemonData) {
  clearHTMLElementContent(pokemonInfoElement)

  const pokemonTitle = document.createElement('h1')
  const pokemonImageContainer = document.createElement('p')
  const pokemonImage = document.createElement('img')
  const pokemonID = document.createElement('p')
  const pokemonWeight = document.createElement('p')
  const pokemonHeight = document.createElement('p')
  const pokemonAbilities = document.createElement('p')

  pokemonTitle.innerHTML = pokemonData.name;
  pokemonImage.setAttribute('src', `${pokemonData.sprites.front_default || ''}`);
  pokemonID.innerHTML = "ID: ";
  pokemonID.innerHTML += pokemonData.id;
  pokemonWeight.innerHTML = "Altura: ";
  pokemonWeight.innerHTML += pokemonData.weight;
  pokemonHeight.innerHTML = "Peso: ";
  pokemonHeight.innerHTML += pokemonData.height;
  pokemonAbilities.innerHTML = "Habilidades: "
  pokemonAbilities.innerHTML += pokemonData.abilities
    .map(val => formatName(val.ability.name).toNormalizedString())
    .reduce((acc, val) => `${acc}, ${val}`)

  pokemonImageContainer.appendChild(pokemonImage);
  pokemonInfoElement.appendChild(pokemonTitle);
  pokemonInfoElement.appendChild(pokemonImageContainer);
  pokemonInfoElement.appendChild(pokemonID);
  pokemonInfoElement.appendChild(pokemonWeight);
  pokemonInfoElement.appendChild(pokemonHeight);
  pokemonInfoElement.appendChild(pokemonAbilities);
}

function buildPokemonTableDataHTML(userPokemons) {
  clearHTMLElementContent(pokemonTableElement);

  for (let userPokemon of userPokemons) {
    api.getPokemon(userPokemon.pokeID)
      .then(poke => {

        const pokemonTableData = document.createElement('tr')
        const pokemonImageColumn = document.createElement('td')
        const pokemonSeenColumn = document.createElement('td')
        const pokemonSearchColumn = document.createElement('td')
        const pokemonFavoriteColumn = document.createElement('td')

        const pokemonImage = document.createElement('img')

        const pokemonSearchButton = document.createElement('button')
        const pokemonSearchButtonImage = document.createElement('img')

        const pokemonFavoriteButton = document.createElement('button')
        const pokemonFavoriteButtonImage = document.createElement('img')

        pokemonSeenColumn.setAttribute('width', '75px')
        pokemonSearchColumn.setAttribute('width', '75px')
        pokemonFavoriteColumn.setAttribute('width', '75px')
        
        pokemonImage.setAttribute('height', '40px')
        pokemonImage.setAttribute('src', `${poke.sprites.front_default}`)
        pokemonImageColumn.appendChild(pokemonImage)
        pokemonImageColumn.innerHTML += poke.name

        pokemonSeenColumn.innerHTML = 'Sim'
        
        pokemonSearchButton.setAttribute('onclick', `handlePokemonData(${userPokemon.pokeID})`)
        pokemonSearchButtonImage.setAttribute('src', 'img/search.png')
        pokemonSearchButtonImage.setAttribute('height', '25px')
        pokemonSearchButton.appendChild(pokemonSearchButtonImage)
        pokemonSearchColumn.appendChild(pokemonSearchButton)
        
        pokemonFavoriteButton.setAttribute('onclick', `favoritePokemon(${userPokemon.id})`)
        pokemonFavoriteButtonImage.setAttribute('height', '25px')
        pokemonFavoriteButtonImage.setAttribute('src', 'img/favBorder.png')
        pokemonFavoriteButton.appendChild(pokemonFavoriteButtonImage)
        pokemonFavoriteColumn.appendChild(pokemonFavoriteButton)

        pokemonTableData.appendChild(pokemonImageColumn)
        pokemonTableData.appendChild(pokemonSeenColumn)
        pokemonTableData.appendChild(pokemonSearchColumn)
        pokemonTableData.appendChild(pokemonFavoriteColumn)
        pokemonTableElement.appendChild(pokemonTableData)
      });
  }
}