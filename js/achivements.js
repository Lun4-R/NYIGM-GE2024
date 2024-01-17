
var achievements = {
  "Best Pressure": {
    requirements: [null, new ExpantaNum(1), new ExpantaNum(1E3), new ExpantaNum(1E5), new ExpantaNum(1E8), new ExpantaNum(1E12)],
    order: new ExpantaNum(1)
  }
}


function updateAchievements() {
  const pressureAchievement = achievements["Best Pressure"];
  let ach1i = pressureAchievement.order.toNumber();
  while (data.pressure.gte(pressureAchievement.requirements[ach1i])) {
    ach1i += 1;
    document.getElementById('best-pressure').classList.add(`achievement-cont-lvl-${ach1i}`);
  }

  document.getElementById('best-pressure-req').textContent = format(pressureAchievement.requirements[ach1i]);
  document.getElementById('best-pressure-lvl').textContent = '★'.repeat(ach1i);

  pressureAchievement.currentLevel = new ExpantaNum(ach1i);
}
