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

function pokeTable(search){
    fetch('../api/users/test/seen')
  .then(response => response.json())
  .then(data => {
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