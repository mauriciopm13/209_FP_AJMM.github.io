function initPage() {
  console.log("Script loaded.");

  let dietData = [];
  let tableauViz1 = null;
  let tableauViz2 = null;
  let viz1Ready = false;
  let viz2Ready = false;

  function buildDietButtons(data) {
    const container = document.getElementById('diet-buttons');
    data.forEach(diet => {
      const link = document.createElement('a');
      link.textContent = diet.name;
      link.href = "#";
      link.addEventListener('click', (e) => {
        e.preventDefault();
        loadDietInfo(diet);
      });
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

    function applyFilter(viz, value) {
      try {
        const sheet = viz.getWorkbook().getActiveSheet();
        if (sheet.getSheetType() === 'dashboard') {
          const worksheets = sheet.getWorksheets();
          worksheets.forEach(ws => {
            ws.applyFilterAsync("Diet", value, tableau.FilterUpdateType.REPLACE).catch(() => {});
          });
        } else {
          sheet.applyFilterAsync("Diet", value, tableau.FilterUpdateType.REPLACE).catch(() => {});
        }
      } catch (err) {
        console.error("Filter error:", err);
      }
    }

    if (diet.filter_value) {
      if (viz1Ready) applyFilter(tableauViz1, diet.filter_value);
      if (viz2Ready) applyFilter(tableauViz2, diet.filter_value);
    }
  }

  function initTableauVizzes() {
    console.log("Initializing Tableau vizzes...");
    const url1 = "https://public.tableau.com/views/FadDietsandFoodImports/FadDietTrendsandUSimports";
    const url2 = "https://public.tableau.com/views/GlobalandUSdiettrends/DietGeoTrends";

    try {
      tableauViz1 = new tableau.Viz(
        document.getElementById("vizContainer1"),
        url1,
        {
          hideTabs: true,
          onFirstInteractive: function () {
            viz1Ready = true;
            console.log("Viz 1 ready");
          }
        }
      );

      tableauViz2 = new tableau.Viz(
        document.getElementById("vizContainer2"),
        url2,
        {
          hideTabs: true,
          onFirstInteractive: function () {
            viz2Ready = true;
            console.log("Viz 2 ready");
          }
        }
      );
    } catch (err) {
      console.error("Failed to load Tableau vizzes:", err);
    }
  }

  // Start!
  fetch('diets_data.json')
    .then(res => res.json())
    .then(data => {
      dietData = data;
      buildDietButtons(data);
    })
    .catch(err => console.error("Failed to load JSON:", err));

  initTableauVizzes();
}

window.initPage = initPage;

