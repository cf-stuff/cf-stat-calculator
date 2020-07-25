import JsonHandler from "./JsonHandler.js";
import {updateDisplay} from "./display.js";

(async function() {
  await JsonHandler.initialise();
  fillOptions();
  updateDisplay();
  document.getElementById("settings").addEventListener("change", updateDisplay);
})();

function fillOptions() {
  document.querySelectorAll("select").forEach(select => {
    const name = select.id.slice(0, -7);
    console.log(name);
    JsonHandler.getJson(name).data
    .forEach(x => {
      const option = document.createElement("option");
      option.textContent = x.name;
      option.value = x.id;
      select.appendChild(option);
    });
  });
}
