//solution goes here

document.addEventListener('DOMContentLoaded', fetchTrainers)
let allTrainers = []

// getters
function getMain() {
  return document.querySelector('main')
}

function getUl(trainerId) {
  return document.getElementById(trainerId).children[2]
}

// fetch trainers
function fetchTrainers() {
  fetch(`http://localhost:3000/trainers`)
  .then(res => res.json())
  .then(trainerArray=>trainerArray.forEach(renderTrainer))
}

// render trainers
function renderTrainer(trainer) {

  //add trainers to trainers array if not already included
  if (!allTrainers.includes(trainer.id )) {
    allTrainers.push(trainer.id)
  }

  // render
  let div = document.createElement('div')
  div.id = trainer.id
  div.className ="card"

  let p = document.createElement('p')
  p.innerText = trainer.name
  div.appendChild(p)

  let button = document.createElement('button')
  button.innerText = 'Add Pokemon'
  button.dataset.id = trainer.id
  button.addEventListener('click', (e)=>{fetchNewPokemon(e); disableButtonsAfterSix(e)})
  div.appendChild(button)

  let ul = document.createElement('ul')
  trainer.pokemons.forEach(pokemon=>{
    let li = addPokemon(pokemon, trainer.id);
    ul.appendChild(li)
  })
  div.appendChild(ul)
  getMain().appendChild(div)
}

// add pokemon li
function addPokemon(pokemon, trainerId) {
  let li = document.createElement('li')
  li.dataset.id = pokemon.id
  let button = document.createElement('button')
  button.dataset.pokemonId = pokemon.id
  button.dataset.trainerId = trainerId
  button.innerText = "Release"
  button.className = "release"
  button.addEventListener('click', (e)=>{fetchDeletePokemon(e);
    releasePokemon(e)})
    li.innerHTML = pokemon.nickname + ` (${pokemon.species})`
    li.append(button)
    return li
  }

  // back-end add
  function fetchNewPokemon(e) {
    let trainerId = e.target.dataset.id
    let data = {trainer_id: trainerId}
    fetch(`http://localhost:3000/pokemons`, {method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)})
    .then(res=>res.json())
    .then(pokemon=>{
      let li = addPokemon(pokemon, trainerId)
      addPokemonToTrainer(li, trainerId)
    })
  }

  // front-end add
  function addPokemonToTrainer(li, trainerId) {
    getUl(trainerId).appendChild(li)
  }

  // back-end delete
  function fetchDeletePokemon(e) {
    let pokemonId = e.target.dataset.pokemonId
    fetch(`http://localhost:3000/pokemons/${pokemonId}`, {method: "DELETE"})
  }

  // front-end delete
  function releasePokemon(e) {
    let pokemonId = e.target.dataset.pokemonId
    let trainerId = e.target.dataset.trainerId
    for (let li of getUl(trainerId).children) {
      if (li.dataset.id === pokemonId) {
        li.remove()
      }
    }
  }

  function disableButtonsAfterSix(e) {
    let trainerId = e.target.dataset.id
    if (getUl(trainerId)) {
      if (getUl(trainerId).childElementCount >= 4)
      {document.querySelector(`button[data-id="${trainerId}"]`).disabled = true;}
      else if (getUl(trainerId).childElementCount <= 5)
      {document.querySelector(`button[data-id="${trainerId}"]`).disabled = false;}
    }
  }
