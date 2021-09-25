function onLoadFunctions(){
  getUser("test")
  pokeTable("test")
}

function getUser(user){
  fetch('../api/users/'+user)
  .then(response => response.json())
  .then(data => {
      var htmlData = data.name;
      document.getElementById("userName").innerHTML = htmlData;
    });
}
function pokeInfo(index){
    fetch('../api/pokemons/'+index)
  .then(response => response.json())
  .then(data => {
      htmlData = "<h1>"+data.name+"</h1>";
      htmlData += "<p><img src='"+data.sprites.front_default+"'> <br>";
      htmlData += "id: "+data.id + "<br>";
      htmlData += "Peso: "+ data.weight +"<br>";
      htmlData += "Altura: "+data.height+"<br>";
      htmlData += "Abilidades: "+data.abilities.map(element => element.ability.name).join(', ');
      
      htmlData += "</p>";
      document.getElementById("pokeinfo").innerHTML = htmlData;
    });
}

function pokeTable(user){
  var urlFetch = "../api/users/test/seen"
  if(user){
    urlFetch = "../api/users/"+user+"/seen"
  }
    fetch(urlFetch)
  .then(response => response.json())
  .then(data => {

    // modelo da table
    // <tr>
    //     <td>caterpie</td>
    //     <td>Sim</td>
    //     <td><button onclick="pokeInfo(10)">info</button></td>
    //     <td><button onclick="fav(10)">fav</button></td>
    // </tr>
    
    var htmlData = "";
    document.getElementById("myTable").innerHTML = "";
    for(let datas of data){
        fetch('../api/pokemons/'+datas.pokeID)
        .then(response => response.json())
        .then(poke => {
        htmlData ="";
        htmlData += "<tr>";
        htmlData += "<td><img src='"+poke.sprites.front_default+"' height='40px'>"+ poke.name +"</td>";
        htmlData += "<td width='75px'>Sim</td>";
        htmlData += "<td width='75px'><button onclick='pokeInfo("+datas.pokeID+")'><img src='img/search.png' height='25px'></button></td>";
        htmlData += "<td width='75px'><button onclick='fav("+datas.pokeID+")'><img src='img/favBorder.png' height='25px'></button></td>";
        htmlData += "</tr>";
        document.getElementById("myTable").innerHTML += htmlData;
        });
    }
      //document.getElementById("myTable").innerHTML = htmlData;
    });
}

function CatchInRegion(region){
  fetch('../api/regions/'+region)
  .then(response => response.json())
  .then(data => {
    fetch('../api/locations/'+rand(data.locations).name)
    .then(response => response.json())
    .then(location => {
      var temp = rand(location.areas)
      console.log(temp)
      fetch('../api/areas/'+temp.name)
      .then(response => response.json())
      .then(area => {
          pokemon = rand(area.pokemon_encounters).pokemon.name;
          Swal.fire(pokemon)
          console.log(pokemon)
        });
      });
    });
}

function rand(items) {
  return items[~~(items.length * Math.random())];
}


window.onload = onLoadFunctions();