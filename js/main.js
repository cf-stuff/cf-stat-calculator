import JsonHandler from "./JsonHandler.js";
import {updateDisplay} from "./display.js";

(async function() {
  await JsonHandler.initialise();

  fillOptions("fighter");
  fillOptions("fighter-reset");
  fillOptions("fighter-healing");
  fillOptions("pet");
  fillOptions("totem");

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
