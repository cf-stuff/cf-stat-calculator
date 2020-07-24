import JsonHandler from "./JsonHandler.js";

export function processInput() {
  //e fighter
  document.getElementById("e-fighter-settings").hidden = !document.getElementById("fighter-evolved").checked;
}

export function createPlayerObject() {
  const output = {
    name: document.getElementById("player-name").value,
    level: document.getElementById("player-level").value,
    fighter: getFighterInfo(),
    pet: getPetInfo(),
    stats: {
      hp: 10000,
      sp: 200,
      minatk: 1000,
      maxatk: 2000,
      spd: 400,
      hit: 1000,
      eva: 100,
      brk: 100,
      def: 2000,
      crt: 1500,
      res: 1000,
    },
    resistance: [
      4, 9
    ],
    totem: getTotemInfo(),
    skills: [
      10, 20, 35, 36, 38, 8, 17
    ]
  };
  return output;
}

function getFighterInfo() {
  const fighterSelect = document.getElementById("fighter-select");
  if (fighterSelect.selectedIndex === 0) {
    return null;
  }
  const fighterId = fighterSelect.options[fighterSelect.selectedIndex].value;
  const evo = document.getElementById("fighter-evolved").checked;
  const skills = [];
  if (evo) {
    const resetSelect = document.getElementById("fighter-reset-select");
    const healingSelect = document.getElementById("fighter-healing-select");
    const resets = [...resetSelect.options]
    .filter(option => option.selected)
    .map(option => option.value);
    if (resets.length > 0) {
      skills.push(resets[0]);
      if (healingSelect.selectedIndex > 0) {
        skills.push(healingSelect.options[healingSelect.selectedIndex].value);
        if (resets.length > 1) {
          skills.push(resets[1]);
        }
      }
    }
  }
  return {
    id: fighterId,
    evo,
    name: JsonHandler.getJson("fighter").data.filter(x => x.id == fighterId)[0].name,
    plus: document.getElementById("fighter-level").value,
    skills
  };
}

function getPetInfo() {
  const petSelect = document.getElementById("pet-select");
  if (petSelect.selectedIndex === 0) {
    return null;
  }
  const petId = petSelect.options[petSelect.selectedIndex].value;
  return {
    id: petId,
    evo: document.getElementById("pet-evolved").checked,
    name: JsonHandler.getJson("pet").data.filter(x => x.id == petId)[0].name,
    plus: document.getElementById("pet-level").value,
    skills: [
      26, "28_1", 106
    ]
  };
}

function getTotemInfo() {
  const totemSelect = document.getElementById("totem-select");
  if (totemSelect.selectedIndex === 0) {
    return null;
  }
  return totemSelect.options[totemSelect.selectedIndex].value;
}
