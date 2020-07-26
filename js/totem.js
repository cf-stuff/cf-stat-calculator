import JsonHandler from "./JsonHandler.js";

let maxTotem = 0;
export function updateTotem() {
  if (getTotemInfo() > maxTotem) {
    maxTotem = getTotemInfo();
    setTotemPresets(maxTotem);
  }
}

function setTotemPresets(totem) {
  if (totem < 1) return;
  const totemInfo = JsonHandler.getJson("totem").data.find(x => x.id == totem);
  for (const stat in totemInfo.stats) {
    document.getElementById(`totem-${stat}`).value = totemInfo.stats[stat];
  }
}

export function getTotemInfo() {
  const totemSelect = document.getElementById("totem-select");
  if (totemSelect.selectedIndex === 0) {
    return null;
  }
  return totemSelect.options[totemSelect.selectedIndex].value;
}
