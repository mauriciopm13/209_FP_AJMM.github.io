let dietData = [];

// Fetch the JSON file with diet info
fetch('diets_data.json')
  .then(response => response.json())
  .then(data => {
    dietData = data;
    buildDietButtons(data);
  });

function buildDietButtons(data) {
  const container = document.getElementById('diet-buttons');
  data.forEach(diet => {
    const link = document.createElement('a');
    link.textContent = diet.name;
    link.addEventListener('click', () => loadDietInfo(diet));
    container.appendChild(link);
  });
}

function loadDietInfo(diet) {
  const dietInfo = document.getElementById('diet-info');

  dietInfo.classList.add('visible');

  document.getElementById('diet-name').textContent = diet.name;
  document.getElementById('diet-summary').textContent = diet.summary;
  document.getElementById('diet-peak').textContent = diet.peak_search_trend;
  document.getElementById('diet-image').src = `Data/${diet.image}`;
  document.getElementById('diet-image').alt = `${diet.name} image`;

  const foodsList = document.getElementById('diet-foods');
  foodsList.innerHTML = '';
  diet.main_foods.forEach(food => {
    const li = document.createElement('li');
    li.textContent = food;
    foodsList.appendChild(li);
  });
}

