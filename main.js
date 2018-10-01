const swapiBase = 'https://swapi.co/api/';
var films = [],
  people = [],
  planets = [],
  species = [],
  starships = [],
  vehicles = [];

$(document).ready(() => {
  $.getJSON(swapiBase, data => {
    let bodyHtml = ``;
    Object.keys(data).forEach(key => {
      bodyHtml += `
				<button class="btn btn-dark text-warning" type="button" data-toggle="collapse" data-target="#${key}-container" aria-expanded="false" aria-controls="${key}-container" 
				onclick="showTopic('${key}', '${data[key]}')">
					<div class="card-title">${_.upperFirst(key)}</div>
				</button>
				<div class="collapse d-flex flex-row justify-content-around flex-wrap" id="${key}-container"></div>`;
    });
    $('#app-container').html(bodyHtml);
  });
});

function showTopic(topic, url) {
  if (this[topic].length === 0) {
    updateProgressBar(topic);
    toggleCollapse(topic); 
    getNext(topic, url);
  } else {
    toggleCollapse(topic);
  }
}

function getNext(topic, url) {
  $.getJSON(url, data => {
    this[topic] = this[topic].concat(data.results);
    updateProgressBar(topic, data.count);
    if (data.next) {
      getNext(topic, data.next);
    } else {
      setTimeout(() => {
        callDisplayTopic(topic);
      }, 500);
    }
  });
}

function updateProgressBar(topic, resultCount = 1) {
  const percent = (this[topic].length / resultCount) * 100;
  const progressBarHtml = document.getElementById(`${topic}-progressBar`);
  if (progressBarHtml) {
    progressBarHtml.style.width = percent + '%';
  } else {
    const progressBar = `
		<div class="progress">
      <div id="${topic}-progressBar" class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" style="width: ${percent}%"></div>
	  </div>
		`;
    $(`#${topic}-container`).html(progressBar);
  }
}

function callDisplayTopic(topic) {
  this[topic] = this[topic].sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
  switch (topic) {
    case 'films':
      displayFilms();
      break;
    case 'people':
      displayPeople();
      break;
    case 'planets':
      displayPlanets();
      break;
    case 'species':
      displaySpecies();
      break;
    case 'starships':
      displayStarships();
      break;
    case 'vehicles':
      displayVehicles();
      break;
  }
}

function displayFilms() {}

function displayPeople() {
  //Figure out how many columns of data will fit on the page
  const numColumns = Math.floor(window.innerWidth / 260);
  
  //Add bootstrap cards for each result item to its repsective column
  let peopleHtml = {};
  people.forEach((person, i) => {
    const colIndex = i % numColumns;
    if (peopleHtml[colIndex] === undefined) {
      peopleHtml[colIndex] = '';
    }
    peopleHtml[colIndex] += `
			<div class=" flex-shrink-0 card bg-dark text-warning item-details">
				<img class="card-image"/>
				<button class="btn btn-dark text-warning" type="button" data-toggle="collapse" data-target="#person-${i}" aria-expanded="false" aria-controls="person-${i}">${person.name}</button>
				<div class="collapse card-content" id="person-${i}">
					<ul>
						<li><strong>Gender: </strong>${_.upperFirst(person.gender)}</li>
						<li><strong>Eye Color: </strong>${_.upperFirst(person.eye_color)}</li>
						<li><strong>Skin Color: </strong>${_.upperFirst(person.skin_color)}</li>
						<li><strong>Height: </strong>${person.height}</li>
						<li><strong>Mass: </strong>${person.mass}</li>
					</ul>
				</div>
			</div>
		`;
  });

  //Wrap each column with flex-column
  let finalHtml = '';
  Object.keys(peopleHtml).forEach(key => {
    finalHtml += `<div class="d-flex flex-column">${peopleHtml[key]}</div>`;
  });
  $('#people-container').html(finalHtml);
}


function displayPlanets() {}

function displaySpecies() {}

function displayStarships() {}

function displayVehicles() {}

function toggleCollapse(topic) {
  const containerId = `#${topic}-container`;
  if(!$(containerId).hasClass('show')) {
    $(containerId).addClass('d-flex');
    $(containerId).collapse('show');
  } else {
    $(containerId).collapse('hide');
    $(containerId).on('hidden.bs.collapse', () => {
      $(containerId).removeClass('d-flex');
    })
  }
}