import JsonHandler from "./JsonHandler.js";
import {updateDisplay} from "./display.js";

(async function() {
  await JsonHandler.initialise();
  [
    "fighter",
    "fighter-reset",
    "fighter-healing",
    "pet",
    "pet-base",
    "pet-evo",
    "totem",
    "skill",
    "resistance"
  ].forEach(fillOptions);

  updateDisplay();
  document.getElementById("settings").addEventListener("change", updateDisplay);
})();

function fillOptions(name) {
  const select = document.getElementById(`${name}-select`);
  JsonHandler.getJson(name).data
  .forEach(x => {
  const option = document.createElement("option");
  option.textContent = x.name;
  option.value = x.id;
  select.appendChild(option);
});
}
