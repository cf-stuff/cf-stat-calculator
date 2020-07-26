import JsonHandler from "./JsonHandler.js";
import {handleExclusivePetSkills, getPetInfo} from "./pet.js";
import {getTotemInfo, updateTotem} from "./totem.js";

const constrain = (x, min, max) => Math.min(Math.max(x, min), max);

export function processInput() {
  // level
  const level = document.getElementById("player-level");
  level.value = constrain(level.value, 1, 100);

  // e fighter
  const fighterSelected = document.getElementById("fighter-select").selectedIndex === 0;
  const evoFighter = document.getElementById("fighter-evolved").checked;
  document.getElementById("e-fighter-settings").hidden = fighterSelected || !evoFighter;
  const fighterLevel = document.getElementById("fighter-level");
  fighterLevel.value = constrain(fighterLevel.value, evoFighter ? 1 : 0, evoFighter ? 21 : 34);

  // pet
  const petSettings = document.getElementById("pet-settings");
  petSettings.hidden = !document.getElementById("pet-select").selectedIndex > 0;
  //id 27 and 28 are exclusive
  if (!petSettings.hidden) {
    handleExclusivePetSkills();
  }

  // e pet
  const evoPet = document.getElementById("pet-evolved").checked;
  document.getElementById("e-pet-settings").hidden = !evoPet;
  document.getElementById("pet-evo-select").hidden = !evoPet;
  const petLevel = document.getElementById("pet-level");
  petLevel.value = constrain(petLevel.value, evoPet ? 1 : 0, evoPet ? 21 : 27);

  // totem
  updateTotem();
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
    resistance: getResistance(),
    totem: getTotemInfo(),
    skills: getSkills()
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
    name: JsonHandler.getJson("fighter").data.find(x => x.id == fighterId).name,
    plus: document.getElementById("fighter-level").value,
    skills
  };
}

function getResistance() {
  return [...document.getElementById("resistance-select").options]
  .filter(option => option.selected)
  .map(option => option.value)
  .splice(0, 2);
}

function getSkills() {
  return [...document.getElementById("skill-select").options]
  .filter(option => option.selected)
  .map(option => option.value)
  .splice(0, 7);
}
