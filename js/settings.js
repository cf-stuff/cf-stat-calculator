import JsonHandler from "./JsonHandler.js";

const constrain = (x, min, max) => Math.min(Math.max(x, min), max);

export function processInput() {
  // level
  const level = document.getElementById("player-level");
  level.value = constrain(level.value, 1, 100);

  // e fighter
  const evoFighter = document.getElementById("fighter-evolved").checked;
  document.getElementById("e-fighter-settings").hidden = !evoFighter;
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
  document.getElementById("e-pet-settings").hidden = !document.getElementById("pet-evolved").checked;

  const evoPet = document.getElementById("pet-evolved").checked;
  document.getElementById("e-pet-settings").hidden = !evoPet;
  const petLevel = document.getElementById("pet-level");
  petLevel.value = constrain(petLevel.value, evoPet ? 1 : 0, evoPet ? 21 : 27);
}

function handleExclusivePetSkills() {
  const selectedPetId = getPetInfo().id;
  const petBaseSelect = document.getElementById("pet-base-select");
  ["27", "28"].forEach(x => {
    const specialSelected = [...petBaseSelect.options]
    .filter(option => option.value.startsWith(x))
    .some(option => option.selected);
    [...petBaseSelect.options]
    .filter(option => option.value.startsWith(x))
    .forEach(option => {
      if (option.value.split("_")[1] === selectedPetId) {
        option.hidden = false;
        option.selected = specialSelected;
      } else {
        option.selected = false;
        option.hidden = true;
      }
    });
  });
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

  const skills = [];
  const possibleSkills = ["25", "26", "28"];
  [...document.getElementById("pet-base-select").options]
  .filter(options => options.selected)
  .map(option => option.value)
  .forEach(id => {
    if (possibleSkills.some(x => id.startsWith(x))) {
      skills.push(id);
    }
  });
  let passiveAdded = false;
  let activeAdded = false;
  [...document.getElementById("pet-evo-select").options]
  .filter(options => options.selected)
  .map(option => option.value)
  .filter(id => id > 90)
  .forEach(id => {
    if (id < 100) {
      if (!passiveAdded) {
        skills.push(id);
        passiveAdded = true;
      }
    } else {
      if (!activeAdded) {
        skills.push(id);
        activeAdded = true;
      }
    }
  });
  return {
    id: petId,
    evo: document.getElementById("pet-evolved").checked,
    name: JsonHandler.getJson("pet").data.filter(x => x.id == petId)[0].name,
    plus: document.getElementById("pet-level").value,
    skills
  };
}

function getTotemInfo() {
  const totemSelect = document.getElementById("totem-select");
  if (totemSelect.selectedIndex === 0) {
    return null;
  }
  return totemSelect.options[totemSelect.selectedIndex].value;
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
