const dataNames = [
  "fighter",
  "fighter-healing",
  "fighter-reset",
  "fighter-skills",
  "pet",
  "petSkill",
  "resistance",
  "skill",
  "totem"
];

const toUrl = item => `../data/${item}.json`;

const loadJson = name => fetch(toUrl(name)).then(res => res.json());

export default class JsonHandler {
  static jsons = new Map();

  static async initialise() {
    const jsons = await Promise.all(dataNames.map(loadJson));
    dataNames.forEach((name, i) => this.jsons.set(name, jsons[i]));
  }

  static getJson(name) {
    return this.jsons.get(name);
  }
}
