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
const pokemonInventoryElement = document.getElementById("inventory")
const pokemonInfoElement = document.getElementById("pokeinfo")

window.onload = onLoadFunctions();

function onLoadFunctions() {
  handleUserName(retrieveUserData().name);
  handlePokeTable(retrieveUserData().name);
  handleinventory(retrieveUserData().name)
  handlePokemonData(1)
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

function handleinventory(user = null) {
  const userFetch = user ? `${user}/caught` : "test/caught";
  
  api
    .getUser(userFetch)
    .then(buildPokemonInventoryDataHTML)
    .catch(buildHTMLElementErrorHandler(pokemonInventoryElement));
}

function catchFromRegion(region) {
  Swal.fire({
    icon: 'info',
    title: 'procurando',
    text: `caçando pokemon em ${region}!`
  })
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
          imageUrl: pokeData.sprites.front_default,
          html:
            `Local: ${formatName(area.name).toNormalizedString()} em ${formatName(area.location.name).toNormalizedString()}` +
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
        }).then((result) => {
          if(result.isConfirmed)
          {
            catchPokemon(pokeData.id, area.location.name, area.name)
            Toastify({
              text: `pegou ${pokeData.name}`, 
              backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
              className: "info",
            }).showToast()
          }
          
        })
      })
      
    });
}

function releasePokemon(pokemon) {
  const user = retrieveUserData()
  fetch(`../api/users/${user.id}/release`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': true ? `Bearer ${retrieveUserToken()}` : '',
    },
    body: JSON.stringify({
      pokemon
    })
  }).then(checkResponseCode)
  .then(handleinventory(retrieveUserData().name))
}

function favoritePokemon(pokemon, name) {
  const user = retrieveUserData()
  fetch(`../api/users/${user.id}/favorite`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': true ? `Bearer ${retrieveUserToken()}` : '',
    },
    body: JSON.stringify({
      pokemon
    })
  }).then(checkResponseCode)
  .then(pokeData => {
    handlePokeTable(retrieveUserData().name)
    handleinventory(retrieveUserData().name)

    Toastify({
    text: `Favoritou ${name}`, 
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    className: "info",
    }).showToast()
  })
}

function unfavoritePokemon(pokemon, name) {
  const user = retrieveUserData()
  fetch(`../api/users/${user.id}/unfavorite`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': true ? `Bearer ${retrieveUserToken()}` : '',
    },
    body: JSON.stringify({
      pokemon
    })
  }).then(checkResponseCode)
  .then(pokeData => {
    handlePokeTable(retrieveUserData().name)
    handleinventory(retrieveUserData().name)

    Toastify({
    text: `Desfavoritou ${name}`, 
    backgroundColor: "linear-gradient(to right, #99309b, #76193d)",
    className: "info",
    }).showToast()
  })
}

function handleRenamePokemon(pokemon, id) {

  api.getPokemon(pokemon)
  .then(pokeData => {
  Swal.fire({
    title: `<strong>renomear ${pokeData.name}?</strong>`,
    imageUrl: pokeData.sprites.front_default,
    html:
      `<form>
        <div class="form-group form-signin" action="#" method="POST" id="form" onsubmit="renamePokemon(); return false>
          <label for="pokenameExample">Nome do pokemon</label>
          <input type="name" class="form-control" id="pokename" aria-describedby="pokename" placeholder="${pokeData.name}">
          <input type="hidden" id="pokeID" name="pokeID" value="${id}">
        </div>
        `,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:
      `<button type="submit" class="btn fa-thumbs-down text-light">Renomear</button>
      </form>`,
    confirmButtonAriaLabel: 'Thumbs up, great!',
    cancelButtonText:
      '<i class="fa fa-thumbs-down">Sair</i>',
    cancelButtonAriaLabel: 'Thumbs down'
    })
    .then((result) => {
      if(result.isConfirmed){
        const pokemon = document.getElementById("pokeID").value;
        const nickname = document.getElementById("pokename").value;
        renamePokemon(pokemon, nickname)
      }
    })
    
  })
}

function renamePokemon(event, pokemon, nickname) {
  event.preventDefault()
  const user = retrieveUserData()
  fetch(`../api/users/${user.id}/rename`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': true ? `Bearer ${retrieveUserToken()}` : '',
    },
    body: JSON.stringify({
      pokemon,
      nickname
    })
  }).then(checkResponseCode)
  .then(pokeData => {
    handlePokeTable(retrieveUserData().name)
    handleinventory(retrieveUserData().name)

    Toastify({
    text: `Renomeou com sucesso`, 
    backgroundColor: "linear-gradient(to right,  #00b09b, #96c93d)",
    className: "info",
    }).showToast()
  })
}

function catchPokemon(pokemon, location, area, nickname) {
  if (nickname = undefined) {
    nickname = api.getPokemon(pokemon).name
  }
  const user = retrieveUserData()
  fetch(`../api/users/${user.id}/catch`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': true ? `Bearer ${retrieveUserToken()}` : '',
    },
    body: JSON.stringify({
      pokemon,
      nickname,
      location,
      area
    })
  }).then(checkResponseCode)
  .then(pokeData => {
    handlePokeTable(retrieveUserData().name)
    handleinventory(retrieveUserData().name)
  })
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
        let favFunc = `favoritePokemon('${userPokemon.id}', '${poke.name}')`
        let favImage = 'img/favBorder.png'
        if(userPokemon.Favorite){
          favImage = 'img/fav.png'
          favFunc = `unfavoritePokemon('${userPokemon.id}', '${poke.name}')`
        }

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
        
        pokemonFavoriteButton.setAttribute('onclick', favFunc)
        pokemonFavoriteButtonImage.setAttribute('height', '25px')
        pokemonFavoriteButtonImage.setAttribute('src', favImage)
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

function buildPokemonInventoryDataHTML(userPokemons) {
  clearHTMLElementContent(pokemonInventoryElement);
  

  for (let userPokemon of userPokemons) {
    api.getPokemon(userPokemon.pokeID)
      .then(poke => {
        
        const pokemonCardData = document.createElement('div')
        const pokemonCardImageData = document.createElement('img')
        const pokemonCardBodyData = document.createElement('div')
        const pokemonCardTitleData = document.createElement('h5')
        const pokemonCardInfoData = document.createElement('a')
        const pokemonCardReleaseData = document.createElement('a')
        pokemonCardData.setAttribute('class', 'card border-danger p-1 m-1')
        pokemonCardData.setAttribute('style', 'width: 11rem')

        pokemonCardImageData.setAttribute('class', 'card-img-top bg-danger')
        pokemonCardImageData.setAttribute('src', `${poke.sprites.front_default  || ''}`)

        pokemonCardBodyData.setAttribute('class', 'card-body')

        pokemonCardTitleData.setAttribute('class', 'card-title')
        pokemonCardTitleData.setAttribute('onclick', `handleRenamePokemon(${userPokemon.pokeID},'${userPokemon.id}')`)
        
        if(userPokemon.nickname == "default")
        {
          pokemonCardTitleData.innerHTML = poke.name
        }else {
          pokemonCardTitleData.innerHTML = userPokemon.nickname
        }

        pokemonCardInfoData.setAttribute('class', 'btn btn-primary')
        pokemonCardInfoData.setAttribute('href', '#pokeinfo')
        pokemonCardInfoData.setAttribute('onclick', `handlePokemonData(${userPokemon.pokeID})`)
        pokemonCardInfoData.innerHTML = "Detalhes"

        pokemonCardReleaseData.setAttribute('class', 'btn btn-danger')
        pokemonCardReleaseData.setAttribute('onclick', `releasePokemon('${userPokemon.id}')`)
        pokemonCardReleaseData.innerHTML = "Soltar"

        pokemonCardData.appendChild(pokemonCardImageData)
        pokemonCardBodyData.appendChild(pokemonCardTitleData)
        pokemonCardBodyData.appendChild(pokemonCardInfoData)
        pokemonCardBodyData.appendChild(pokemonCardReleaseData)
        pokemonCardData.appendChild(pokemonCardBodyData)

        pokemonInventoryElement.appendChild(pokemonCardData)
      })
    }
  }