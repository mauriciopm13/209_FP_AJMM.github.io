let dietData = [];
let tableauViz1 = null;
let tableauViz2 = null;


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

  function applyFilterToViz(viz, filterValue) {
    const sheet = viz.getWorkbook().getActiveSheet();
  
    // If it's a dashboard, get the right worksheet inside it
    let targetSheet = sheet;
    if (sheet.getSheetType() === 'dashboard') {
      const worksheets = sheet.getWorksheets();
  
      worksheets.forEach(ws => {
        // Try applying the filter to each worksheet (some might not have the filter, which is okay)
        ws.applyFilterAsync("Diet", filterValue, tableau.FilterUpdateType.REPLACE).catch(() => {});
      });
    } else {
      targetSheet.applyFilterAsync("Diet", filterValue, tableau.FilterUpdateType.REPLACE).catch(() => {});
    }
  }
  
  if (diet.filter_value) {
    if (tableauViz1) applyFilterToViz(tableauViz1, diet.filter_value);
    if (tableauViz2) applyFilterToViz(tableauViz2, diet.filter_value);
  }
  
}

function initTableauVizzes() {
  const url1 = "https://public.tableau.com/views/FadDietTrendsandUSimports/FadDietTrendsandUSimports";
  const url2 = "https://public.tableau.com/views/GlobalUSFadDietTrends/DietGeoTrends";

  const options1 = {
    hideTabs: true,
    onFirstInteractive: function () {
      tableauViz1 = viz1; // now it's fully ready
      console.log("Viz 1 is ready!");
    }
  };

  const options2 = {
    hideTabs: true,
    onFirstInteractive: function () {
      tableauViz2 = viz2; // now it's fully ready
      console.log("Viz 2 is ready!");
    }
  };

  const viz1 = new tableau.Viz(document.getElementById("vizContainer1"), url1, options1);
  const viz2 = new tableau.Viz(document.getElementById("vizContainer2"), url2, options2);
}


initTableauVizzes();

