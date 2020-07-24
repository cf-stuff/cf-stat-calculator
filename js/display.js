import ImageHandler from "./ImageHandler.js";
import {processInput, createPlayerObject} from "./settings.js";

export async function updateDisplay() {
  processInput();

  console.log("updating display...");
  const ctx = document.getElementById("display-foreground").getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const playerObject = createPlayerObject();

  if (!playerObject.fighter) {
    return;
  }

  // name
  ctx.font = "bold 1.3em arial";
  ctx.fillStyle = "#000000";
  ctx.fillText(`${playerObject.name}`, 107, 29);

  // level
  ctx.font = "1.3em arial";
  ctx.fillStyle = "#FFFFFF";
  const playerLevel = playerObject.level;
  ctx.fillText(`lv${playerLevel.length === 3 ? "" : "l"}: ${playerObject.level}`, 13, 118);

  // stat box thing
  ctx.fillStyle = "rgba(25, 0, 21, 0.9)";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.roundRect(-20, 150, 250, playerObject.fighter.skills.length > 0 ? 500 : 430, 20);

  // totem
  if (playerObject.totem) {
    ctx.drawImage(await ImageHandler.getImage("totem", playerObject.totem), 300, 400);
  }

  // fighter + pet
  ctx.drawImage(await ImageHandler.getImage("fighter", playerObject.fighter.id), 35, 20);
  ctx.font = "bold 1em arial";
  ctx.fillStyle = "#a15f08";
  ctx.fillText(`${playerObject.fighter.name}`, 15, 180);
  if (playerObject.pet) ctx.fillText(`${playerObject.pet.name}`, 15, 200);

  const fighterNameWidth = ctx.measureText(playerObject.fighter.name).width;
  const petNameWidth = (playerObject.pet) ? ctx.measureText(playerObject.pet.name).width : 0;

  ctx.font = "1em arial";
  ctx.fillStyle = "#c2ac3d";
  ctx.fillText(` +${playerObject.fighter.plus}`, 15 + fighterNameWidth, 180);
  if (playerObject.pet) ctx.fillText(` +${playerObject.pet.plus}`, 15 + petNameWidth, 200);

  lineSeparator(ctx, 210);

  // resistance
  ctx.font = "1.2em arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Resistance", 15, 240);
  playerObject.resistance.forEach(async (x, i) => ctx.drawImage(
    await ImageHandler.getImage("resistance", x), 0, 0, 78, 73, 120 + 45 * i, 215, 39, 36.5));
  
  lineSeparator(ctx, 250);

  // stats
  // hp + sp
  ctx.font = "1.3em arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText(`${playerObject.stats.hp}/${playerObject.stats.hp}`, 290, 53);
  ctx.fillText(`${playerObject.stats.sp}/${playerObject.stats.sp}`, 320, 82);

  // atk
  ctx.textAlign = "start";
  ctx.font = "1.1em arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("ATK", 15, 280);
  ctx.fillStyle = "#b6a357";
  ctx.fillText(` ${playerObject.stats.minatk} ~ ${playerObject.stats.maxatk}`, 55, 280);

  // spd
  ctx.font = "1.1em arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("SPD", 15, 305);
  ctx.fillStyle = "#b6a357";
  ctx.fillText(` ${playerObject.stats.spd}`, 55, 305);

  // hit
  ctx.font = "1.1em arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("HIT", 15, 330);
  ctx.fillStyle = "#b6a357";
  ctx.fillText(` ${playerObject.stats.hit}`, 50, 330);

  // eva
  ctx.font = "1.1em arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("EVA", 105, 330);
  ctx.fillStyle = "#b6a357";
  ctx.fillText(` ${playerObject.stats.eva}`, 140, 330);

  // brk
  ctx.font = "1.1em arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("BRK", 15, 355);
  ctx.fillStyle = "#b6a357";
  ctx.fillText(` ${playerObject.stats.brk}`, 50, 355);

  // def
  ctx.font = "1.1em arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("DEF", 105, 355);
  ctx.fillStyle = "#b6a357";
  ctx.fillText(` ${playerObject.stats.def}`, 140, 355);

  // crt
  ctx.font = "1.1em arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("CRT", 15, 380);
  ctx.fillStyle = "#b6a357";
  ctx.fillText(` ${playerObject.stats.crt}`, 50, 380);

  // res
  ctx.font = "1.1em arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("RES", 105, 380);
  ctx.fillStyle = "#b6a357";
  ctx.fillText(` ${playerObject.stats.res}`, 140, 380);

  lineSeparator(ctx, 400);

  // skills
  let skillIndex = 0;
  let petSkillIndex = 0;
  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 4; ++x) {
      ctx.drawImage(await ImageHandler.getImageFromUrl("../images/display/skill-frame.png"), 0, 0, 36, 36, 15 + x * 50, 415 + y * 50, 45, 45);
      if (skillIndex < playerObject.skills.length) {
        ctx.drawImage(await ImageHandler.getImage("skill", playerObject.skills[skillIndex++]), 0, 0, 64, 64, 17 + x * 50, 417 + y * 50, 41, 41);
      } else if (playerObject.pet && petSkillIndex < playerObject.pet.skills.length) {
        ctx.drawImage(await ImageHandler.getImage("petSkill", playerObject.pet.skills[petSkillIndex++]), 0, 0, 64, 64, 18 + x * 50, 418 + y * 50, 39, 39);
      }
    }
  }

  if (playerObject.fighter.skills.length === 0) {
    return;
  }

  lineSeparator(ctx, 575);

  // resets
  let resetIndex = 0;
  for (let x = 0; x < 4; ++x) {
    ctx.drawImage(await ImageHandler.getImageFromUrl("../images/display/skill-evo-frame.png"), 0, 0, 36, 36, 15 + x * 50, 590, 45, 45);
    if (resetIndex < playerObject.fighter.skills.length) {
      ctx.drawImage(await ImageHandler.getImage("fighter-skills", playerObject.fighter.skills[resetIndex++]), 0, 0, 64, 64, 18 + x * 50, 593, 39, 39);
    }
  }
}

function lineSeparator(ctx, y) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#9c8563";
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(225, y);
  ctx.stroke();
  ctx.restore();
}

CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius = 5, stroke = true) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
  if (stroke) {
    this.stroke();
  }
  this.fill();
}
