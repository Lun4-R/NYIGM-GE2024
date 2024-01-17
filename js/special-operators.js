function clampMax(inp, max) {
  if (inp.gte(max)) {
    return max;
  } else {
    return inp;
  }
}

function clampMin(inp, min) {
  if (inp.lte(min)) {
    return min;
  } else {
    return inp;
  }
}

function affordGeometricSeries_v1(resourcesAvailable, priceStart, priceRatio, currentOwned)  {
  return this.affordGeometricSeries_core(new ExpantaNum(resourcesAvailable), new ExpantaNum(priceStart), new ExpantaNum(priceRatio), currentOwned);
}

affordGeometricSeries_core = function(resourcesAvailable, priceStart, priceRatio, currentOwned) {
  var actualStart = priceStart.mul(priceRatio.pow(currentOwned));
  return ExpantaNum.floor(resourcesAvailable.div(actualStart).mul(priceRatio.sub(1)).add(1).log10().div(priceRatio.log10()));
};