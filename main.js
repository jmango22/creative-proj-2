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



function displayFilms() {
  const filmParser = (film) => {
    return {
      'Director': film.director,
      'Producer': film.producer,
      'Release Date': film.release_date
    };
  };

  const getTitle = (film) => {
    return film.title;
  };

  displayItem(films, 'films', 'film', getTitle, filmParser);
}

function displayPeople() {
  const peopleParser = (person) => {
    return {
      'Gender': _.upperFirst(person.gender), 
      'Eye Color': _.upperFirst(person.eye_color),
      'Skin Color': _.upperFirst(person.skin_color),
      'Height': person.height,
      'Mass': person.mass
    };
  };

  const getTitle = (person) => {
    return person.name;
  };

  displayItem(people, 'people', 'person', getTitle, peopleParser);
}

function displayPlanets() {
  const planetParser = (planet) => {
    return {
      'Population': planet.population,
      'Climate': planet.climate,
      'Terrain': planet.terrain,
      'Gravity': planet.gravity,
      'Diameter': planet.diameter,
      'Rotation Period': planet.rotation_period,
      'Orbital Period': planet.orbital_period,
    };
  };

  const getTitle = (planet) => {
    return planet.name;
  };

  displayItem(planets, 'planets', 'planet', getTitle, planetParser);
}

function displaySpecies() {
  const speciesParser = (species) => {
    return {
      'Average Height': species.average_height,
      'Average Lifespan': species.average_lifespan,
      'Classification': species.classification,
      'Designation': species.designation,
      'Eye Colors': species.eye_colors,
      'Hair Colors': species.hair_colors,
      'Language': species.language,
      'Skin Colors': species.skin_colors,
    };
  };

  const getTitle = (species) => {
    return species.name;
  };

  displayItem(species, 'species', 'species', getTitle, speciesParser);
}

function displayStarships() {
  const starshipsParser = (starship) => {
    return {
      'MGLT': starship.MGLT,
      'Cargo Capacity': starship.cargo_capacity,
      'Consumables': starship.consumables,
      'Cost in Credits': starship.cost_in_credits,
      'Crew': starship.crew,
      'Hyperdrive Rating': starship.hyperdrive_rating,
      'Length': starship.length,
      'Manufacturer': starship.manufacturer,
      'Max Atmosphering Speed': starship.max_atmosphering_speed,
      'Model': starship.model,
      'Passengers': starship.passengers,
      'Starship Class': starship.starship_class,
    };
  };

  const getTitle = (starship) => {
    return starship.name;
  };

  displayItem(starships, 'starships', 'starship', getTitle, starshipsParser);
}

function displayVehicles() {
  const vehiclesParser = (vehicle) => {
    return {
      'Cargo Capacity': vehicle.cargo_capacity,
      'Consumables': vehicle.consumables,
      'Cost in Credits': vehicle.cost_in_credits,
      'Crew': vehicle.crew,
      'Length': vehicle.length,
      'Manufacturer': vehicle.manufacturer,
      'Max Atmosphering Speed': vehicle.max_atmosphering_speed,
      'Model': vehicle.model,
      'Passengers': vehicle.passengers,
      'Vehicle Class': vehicle.vehicle_class
    };
  };

  const getTitle = (vehicle) => {
    return vehicle.name;
  };

  displayItem(vehicles, 'vehicles', 'vehicle', getTitle, vehiclesParser);
}

function displayItem(itemList, type, singleType, itemTitle, itemParser) {
  //Figure out how many columns of data will fit on the page
  const numColumns = Math.floor(window.innerWidth / 260);
 
  //Add bootstrap cards for each result item to its repsective column
  let itemsHtml = {};
  itemList.forEach((item, i) => {
    const colIndex = i % numColumns;
    if (itemsHtml[colIndex] === undefined) {
      itemsHtml[colIndex] = '';
    }

    parsedItem = itemParser(item);
    itemsHtml[colIndex] += getCard(singleType, i, itemTitle(item), itemParser(item));
  });

  //Wrap each column with flex-column
  let finalHtml = '';
  Object.keys(itemsHtml).forEach(key => {
    finalHtml += `<div class="d-flex flex-column">${itemsHtml[key]}</div>`;
  });
  $(`#${type}-container`).html(finalHtml);
}

function getCard(type, itemNum, title, obj) {
  return `
    <div class=" flex-shrink-0 card bg-dark text-warning item-details">
      <img class="card-image"/>
      <button class="btn btn-dark text-warning" type="button" data-toggle="collapse" data-target="#${type}-${itemNum}" aria-expanded="false" aria-controls="${type}-${itemNum}">${title}</button>
      <div class="collapse card-content" id="${type}-${itemNum}">
        <ul>
          ${getCardList(obj)}
        </ul>
      </div>
    </div>
  `;
}

// Takes an object a keys (Names) and values
function getCardList(obj) {
  let list = '';
  Object.keys(obj).forEach(key => {
    list += `<li><strong>${key}: </strong>${obj[key]}</li>\n`;
  });
  return list;
}

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