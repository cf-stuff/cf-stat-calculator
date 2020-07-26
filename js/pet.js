import JsonHandler from "./JsonHandler.js";

export function handleExclusivePetSkills() {
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

export function getPetInfo() {
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
    name: JsonHandler.getJson("pet").data.find(x => x.id == petId).name,
    plus: document.getElementById("pet-level").value,
    skills
  };
}
