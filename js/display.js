import ImageHandler from "./ImageHandler.js";
import {processInput, createPlayerObject} from "./settings.js";

export async function updateDisplay() {
  processInput();

  const foreground = document.getElementById("display-foreground");
  const buffer = document.createElement("canvas");
  buffer.width = foreground.width;
  buffer.height = foreground.height;

  const ctx = buffer.getContext("2d");
  ctx.clearRect(0, 0, buffer.width, buffer.height);

  const playerObject = createPlayerObject();

  if (!playerObject.fighter) {
    return;
  }

  // name
  ctx.font = "bold 21px arial";
  ctx.fillStyle = "#000000";
  ctx.fillText(`${playerObject.name}`, 107, 29);

  // level
  ctx.font = "21px arial";
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
  ctx.font = "bold 16px arial";
  ctx.fillStyle = "#a15f08";
  ctx.fillText(`${playerObject.fighter.name}`, 15, 180);
  if (playerObject.pet) ctx.fillText(`${playerObject.pet.name}`, 15, 200);

  const fighterNameWidth = ctx.measureText(playerObject.fighter.name).width;
  const petNameWidth = (playerObject.pet) ? ctx.measureText(playerObject.pet.name).width : 0;

  ctx.font = "16px arial";
  ctx.fillStyle = "#c2ac3d";
  ctx.fillText(` +${playerObject.fighter.plus}`, 15 + fighterNameWidth, 180);
  if (playerObject.pet) ctx.fillText(` +${playerObject.pet.plus}`, 15 + petNameWidth, 200);

  lineSeparator(ctx, 210);

  // resistance
  ctx.font = "19px arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Resistance", 15, 240);
  for (let i = 0; i < playerObject.resistance.length; ++i)
    ctx.drawImage(await ImageHandler.getImage("resistance", playerObject.resistance[i]), 120 + 40 * i, 215, 39, 36.5);
  
  lineSeparator(ctx, 250);

  // stats
  displayStats(ctx, playerObject.stats);

  lineSeparator(ctx, 400);

  // skills
  let skillIndex = 0;
  let petSkillIndex = 0;
  for (let y = 0; y < 3; ++y) {
    for (let x = 0; x < 4; ++x) {
      ctx.drawImage(await ImageHandler.getImageFromUrl("images/display/skill-frame.png"), 15 + x * 50, 415 + y * 50, 45, 45);
      if (skillIndex < Math.min(6, playerObject.skills.length)) {
        ctx.drawImage(await ImageHandler.getImage("skill", playerObject.skills[skillIndex++]), 17 + x * 50, 417 + y * 50, 41, 41);
      } else if (playerObject.pet && petSkillIndex < playerObject.pet.skills.length) {
        ctx.drawImage(await ImageHandler.getImage("petSkill", playerObject.pet.skills[petSkillIndex++]), 17 + x * 50, 417 + y * 50, 41, 41);
      } else if (skillIndex < playerObject.skills.length) {
        ctx.drawImage(await ImageHandler.getImage("skill", playerObject.skills[skillIndex++]), 17 + x * 50, 417 + y * 50, 41, 41);
      }
    }
  }

  // resets
  if (playerObject.fighter.skills.length > 0) {
    lineSeparator(ctx, 575);

  let resetIndex = 0;
  for (let x = 0; x < 4; ++x) {
    ctx.drawImage(await ImageHandler.getImageFromUrl("images/display/skill-evo-frame.png"), 15 + x * 50, 590, 45, 45);
    if (resetIndex < playerObject.fighter.skills.length) {
      ctx.drawImage(await ImageHandler.getImage("fighter-skills", playerObject.fighter.skills[resetIndex++]), 17 + x * 50, 592, 41, 41);
    }
  }
  }

  

  const fg = foreground.getContext("2d");
  fg.clearRect(0, 0, fg.canvas.width, fg.canvas.height);
  fg.drawImage(buffer, 0, 0);
}

function displayStats(ctx, stats) {
  // hp + sp
  ctx.font = "21px arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`${stats.hp}/${stats.hp}`, 235, 53);
  ctx.fillText(`${stats.sp}/${stats.sp}`, 285, 82);

  // stat names
  ctx.font = "18px arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("ATK", 15, 280);
  ctx.fillText("SPD", 15, 305);
  ctx.fillText("HIT", 15, 330);
  ctx.fillText("EVA", 105, 330);
  ctx.fillText("BRK", 15, 355);
  ctx.fillText("DEF", 105, 355);
  ctx.fillText("CRT", 15, 380);
  ctx.fillText("RES", 105, 380);

  // stat values
  ctx.fillStyle = "#b6a357";
  ctx.fillText(` ${stats.minatk} ~ ${stats.maxatk}`, 55, 280);
  ctx.fillText(` ${stats.spd}`, 55, 305);
  ctx.fillText(` ${stats.hit}`, 50, 330);
  ctx.fillText(` ${stats.eva}`, 140, 330);
  ctx.fillText(` ${stats.brk}`, 50, 355);
  ctx.fillText(` ${stats.def}`, 140, 355);
  ctx.fillText(` ${stats.crt}`, 50, 380);
  ctx.fillText(` ${stats.res}`, 140, 380);
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
