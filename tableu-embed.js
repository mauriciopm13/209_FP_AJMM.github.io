console.log("Script loaded.");

let dietData = [];

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...");

  // Fetch and build diet buttons
  fetch("diets_data.json")
    .then((res) => res.json())
    .then((data) => {
      dietData = data;
      buildDietButtons(data);
    })
    .catch((err) => console.error("Failed to load JSON:", err));
});

function buildDietButtons(data) {
  const container = document.getElementById("diet-buttons");
  data.forEach((diet) => {
    const link = document.createElement("a");
    link.textContent = diet.name;
    link.href = "#";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      loadDietInfo(diet);
    });
    container.appendChild(link);
  });
}

async function loadDietInfo(diet) {
  document.getElementById("diet-info").classList.add("visible");
  document.getElementById("diet-name").textContent = diet.name;
  document.getElementById("diet-summary").textContent = diet.summary;
  document.getElementById("diet-peak").textContent = diet.peak_search_trend;
  document.getElementById("diet-image").src = `Data/${diet.image}`;
  document.getElementById("diet-image").alt = `${diet.name} image`;

  const foodsList = document.getElementById("diet-foods");
  foodsList.innerHTML = "";
  diet.main_foods.forEach((food) => {
    const li = document.createElement("li");
    li.textContent = food;
    foodsList.appendChild(li);
  });

  // Apply filter if visualizations are ready
  if (diet.filter_value) {
    await applyFilterToViz("tableauViz1", "Diet", diet.filter_value);
    await applyFilterToViz("tableauViz2", "Diet", diet.filter_value);
  }
}

async function applyFilterToViz(vizId, fieldName, value) {
  try {
    const vizEl = document.getElementById(vizId);
    await vizEl.initialized;
    const workbook = await vizEl.workbook;
    const activeSheet = await workbook.activeSheet;

    if (activeSheet.sheetType === "dashboard") {
      const sheets = await activeSheet.worksheets;
      for (const sheet of sheets) {
        try {
          await sheet.applyFilterAsync(fieldName, value, "replace");
        } catch (e) {
          console.warn(`Filter failed on ${sheet.name}`);
        }
      }
    } else {
      await activeSheet.applyFilterAsync(fieldName, value, "replace");
    }
  } catch (err) {
    console.error(`Error applying filter to ${vizId}:`, err);
  }
}
