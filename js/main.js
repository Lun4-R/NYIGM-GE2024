
var PRE_dT = performance.now();

function compress() {
  let base = new ExpantaNum(1.1)
  let min = new ExpantaNum(1E-10)
  base = base.add(ExpantaNum.div(data.p_u1_level, 10))
  min = min.mul(PU2Effect())
  data.volume = data.volume.div(base);
  data.volume = clampMin(data.volume, data.min_volume);
  data.volume_compression = base
  data.min_volume = min
}

function prestige() {
  if (data.pressure.gte(data.prestige_threshold)) {
    data.prestige_points = data.prestige_points.add(calculatePrestigePoints())
    
    data.volume = new ExpantaNum(1),
    data.pressure = new ExpantaNum(0)
  }
}

function buyPU1() {
  let cost = new ExpantaNum(0.5).mul(ExpantaNum.pow(1.75, data.p_u1_level))
  
  if (data.prestige_points.gte(cost)) {
    data.prestige_points = data.prestige_points.sub(cost)
    data.p_u1_level = data.p_u1_level.add(1)
  }
}

function PU1Handler() {
  let cost = new ExpantaNum(0.5).mul(ExpantaNum.pow(1.75, data.p_u1_level))
  return cost
}

function buyPU2() {
  let cost = new ExpantaNum(2).mul(ExpantaNum.pow(1.25, data.p_u2_level))

  if (data.prestige_points.gte(cost)) {
    data.prestige_points = data.prestige_points.sub(cost)
    data.p_u2_level = data.p_u2_level.add(1)
  }
}

function buyPU3() {
  let cost = new ExpantaNum(150)
  
  if (data.prestige_points.gte(cost) && data.p_u3_state.eq(0)) {
    data.prestige_points = data.prestige_points.sub(cost)
    data.p_u3_state = new ExpantaNum(1)
  }
}

function PU3Handler() {
  let cost = new ExpantaNum(150)
  return cost
}

function PU2Handler() {
  let cost = new ExpantaNum(2).mul(ExpantaNum.pow(1.25, data.p_u2_level))
  return cost
}

function PU2Effect() {
  let effect = new ExpantaNum(1).mul(ExpantaNum.pow(1.175, data.p_u2_level))
  return effect
}

function calculatePressure(dT) {
  let baseCalc = new ExpantaNum.mul(new ExpantaNum(1).div(data.volume), data.min_volume)
  baseCalc = baseCalc.mul(2).pow(2)
  baseCalc = baseCalc.mul(PU2Effect())
  baseCalc = baseCalc.mul(data.energy.gte(1) ? calculateEnergyEffect() : 1) 
  data.pressure = data.pressure.add(baseCalc.mul(dT));
  return baseCalc;
}

function calculateEnergy(dT) {
  if (data.p_u3_state.eq(1) && data.pressure.gte(1)) {
  let baseCalc = new ExpantaNum(1).div(clampMin(data.pressure.div(100), 1))
  data.energy = data.energy.add(baseCalc.mul(dT))
  return baseCalc
  }
  else return new ExpantaNum(0)
}

function calculateEnergyDisplay() {
  if (data.p_u3_state.eq(1) && data.pressure.gte(1)) {
    let baseCalc = new ExpantaNum(1).div(clampMin(data.pressure.div(100), 1))
    return baseCalc
  }
  else return new ExpantaNum(0)
}

function calculateEnergyEffect() {
  let base = new ExpantaNum(1).mul(ExpantaNum.pow(data.energy, 0.1).pow(2))
  return base
}

function calculatePrestigePoints() {
  let calc = new ExpantaNum.pow(ExpantaNum.div(data.pressure.sub(150), 100), 1.25)
  calc = calc.mul(data.energy.gte(1) ? calculateEnergyEffect() : 1) 
  return calc
}

function calculatePrestigePointsDisplay() {
  let calc = new ExpantaNum.pow(ExpantaNum.div(data.pressure.sub(150), 100), 1.25)
  calc = calc.mul(data.energy.gte(1) ? calculateEnergyEffect() : 1) 
  return calc
}

function calculatePressureDisplay() {
  let baseCalc = new ExpantaNum.mul(new ExpantaNum(1).div(data.volume), data.min_volume);
  baseCalc = baseCalc.mul(2).pow(2)
  baseCalc = baseCalc.mul(PU2Effect())
  baseCalc = baseCalc.mul(data.energy.gte(1) ? calculateEnergyEffect() : 1) 
  return baseCalc;
}

function updateDisplays() {
  document.getElementById('volume').innerHTML = `<span>${format(data.volume)} m<sup>3</sup></span>`;
  document.getElementById('pressure').innerHTML = `<span>${format(data.pressure)} mPa</span> <span> ( ${format(calculatePressureDisplay())} mPa / sec )`;
  document.getElementById('min-compress').textContent = `${format(data.min_volume)}`;
  document.getElementById('prestige-point').innerHTML = `${format(data.prestige_points)}`;
  if (data.p_u3_state.eq(1)) {
    document.getElementById('p-energy-text').innerHTML = `You have <span id="mono">${format(data.energy)}</span> Prestige Energy <img class="cen" src='images/Prestige_Energy.png' height=32 width=32>`;
    if (data.p_u3_state.eq(1) && data.energy.gte(1)) {
      document.getElementById('p-energy-text').innerHTML = `You have <span id="mono">${format(data.energy)}</span> Prestige Energy <img class="cen" src='images/Prestige_Energy.png' height=32 width=32> ( <span id="mono">${format(calculateEnergyEffect())}x</span> to currencies )`;
    }
  }
  else document.getElementById('p-energy-text').innerHTML = ``;
  
  document.getElementById('compress-btn').innerHTML = `Compress the gas<sup>TM</sup> by ${format((data.volume_compression).mul(10))}%`;
  
  if (!data.pressure.lte(data.prestige_threshold)) {
  document.getElementById('prestige-btn-text').innerHTML = `Reset for ${format(calculatePrestigePointsDisplay())} Prestige Points  <img class="cen" src='images/Prestige_Cubes.png' height=32 width=32>`
  } else {
    document.getElementById('prestige-btn-text').innerHTML = `You need ${format(data.prestige_threshold)} mPa of Pressure`
  }
  document.getElementById('prestige-upgrade-1-t').innerHTML = `Stronger Compression ${data.p_u1_level}`
  document.getElementById('prestige-upgrade-1-e').innerHTML = `Currently: +${format(data.p_u1_level)} to base`
  document.getElementById('prestige-upgrade-1-c').innerHTML = `Cost: ${format(PU1Handler())} Prestige Points  <img class="cen" src='images/Prestige_Cubes.png' height=32 width=32>`
  
  document.getElementById('prestige-upgrade-2-t').innerHTML = `Improved Compression ${data.p_u1_level}`
  document.getElementById('prestige-upgrade-2-e').innerHTML = `Currently: *${format(PU2Effect())} of improvement`
  document.getElementById('prestige-upgrade-2-c').innerHTML = `Cost: ${format(PU2Handler())} Prestige Points  <img class="cen" src='images/Prestige_Cubes.png' height=32 width=32>`
  
  if (data.p_u3_state.eq(1)) {
  document.getElementById('prestige-upgrade-3-t').innerHTML = `Expansion I ( BOUGHT )`
  } else {
    document.getElementById('prestige-upgrade-3-t').innerHTML = `Expansion I`
  }
  document.getElementById('prestige-upgrade-3-e').innerHTML = `Gain passively it, higher pressure decreases its production however it will boost P and PP`
  document.getElementById('prestige-upgrade-3-c').innerHTML = `Cost: ${format(PU3Handler())} Prestige Points  <img class="cen" src='images/Prestige_Cubes.png' height=32 width=32>`
  
}

function gameLoop() {
  var dT = performance.now() - PRE_dT;
  calculatePressure(dT / 1000);
  calculateEnergy(dT / 1000);
  updateDisplays();
  updateAchievements();
  calculatePrestigePoints();
  tabLogic();
  PRE_dT = performance.now();
}

setInterval(gameLoop, 33);

