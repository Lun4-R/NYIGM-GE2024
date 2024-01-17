// HOW TO USE 
// This save system is simplified version of TMT's one basically.
// We first convert ExpantaNum values or any else num libary ones to string, which is not very efficient way to save data but easiest way
// 
// That save is considered as a data object with a "special" key ( its not very, its just there to identifiy what save to retrive ) which can be retrived on load or on demand. ( <<< FUTURE PLAN, IF I HAVE TIME )
// DS-00000004 is a key, which will have your save. Changing it will effectively gets rid of your save but also allows to make another entry if that 5MB limit was exceeded
//
// EX.
// saveData(playerdata,            "bleh")
//          ^ it takes the array    ^ and the key
// now you will need to manually serialize it, because how it makes your own and my workflow easier ( foreshadowing ) plus it can provide some interesting game mechanics
// ALSO DO NOT MOVE DATA/EXISTINGDATA ANYWHERE ELSE THAN HERE
function saveData(dataObject, key) {
  try {
    var serializedData = JSON.stringify({
      volume: dataObject.volume.toString(),
      volume_compression: dataObject.volume_compression.toString(),
      min_volume: dataObject.min_volume.toString(),
      pressure: dataObject.pressure.toString(),
      energy: dataObject.energy.toString(),
      prestige_points: dataObject.prestige_points.toString(),
      prestige_threshold: dataObject.prestige_threshold.toString(),
      
      p_u1_level: dataObject.p_u1_level.toString(),
      p_u2_level: dataObject.p_u2_level.toString(),
      p_u3_state: dataObject.p_u3_state.toString()
    });

    localStorage.setItem(key, serializedData);
    console.log('Save successful!');
  } catch (error) {
    console.error('Error saving:', error);
  }
}

function retrieveData(key) {
  try {
    var savedData = localStorage.getItem(key);

    if (savedData) {
      var parsedData = JSON.parse(savedData);
      
      // NaN failsafe
      function antiNaN(value, defaultValue) {
        return ExpantaNum.isNaN(value) ? defaultValue : value;
      }

      var retrievedData = {
        volume: new ExpantaNum(antiNaN(parsedData.volume, 1)),
        volume_compression: new ExpantaNum(antiNaN(parsedData.volume_compression, 1.1)),
        min_volume: new ExpantaNum(antiNaN(parsedData.min_volume, 1E-10)),
        pressure: new ExpantaNum(antiNaN(parsedData.pressure, 0)),
        energy: new ExpantaNum(antiNaN(parsedData.energy, 0)),
        prestige_points: new ExpantaNum(antiNaN(parsedData.prestige_points, 0)),
        prestige_threshold: new ExpantaNum(antiNaN(parsedData.prestige_threshold, 150)),
        
        p_u1_level: new ExpantaNum(antiNaN(parsedData.p_u1_level, 0)),
        p_u2_level: new ExpantaNum(antiNaN(parsedData.p_u2_level, 0)),
        p_u3_state: new ExpantaNum(antiNaN(parsedData.p_u3_state, 0))
      };

      console.log('Successfully retrieved save:', retrievedData);
      return retrievedData;
    } else {
      console.log('No save found in LocalStorage.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving save:', error);
    return null;
  }
}

function hardReset() {
  // Add a confirmation prompt
  var confirmed = confirm("Are you sure you want to perform a hard reset?");
  if (!confirmed) return;

  localStorage.removeItem('DS-00000005'); 
  data = {
    volume: new ExpantaNum(1),
    volume_compression: new ExpantaNum(1.1),
    min_volume: new ExpantaNum(1E-10),
    pressure: new ExpantaNum(0),
    energy: new ExpantaNum(0),
    prestige_points: new ExpantaNum(0),
    prestige_threshold: new ExpantaNum(150),
    
    p_u1_level: new ExpantaNum(0),
    p_u2_level: new ExpantaNum(0),
    p_u3_state: new ExpantaNum(0)
  };

  saveData(data, 'DS-00000005');
  window.location.reload();
}

var existingData = retrieveData('DS-00000005');
var data = existingData || {
  volume: new ExpantaNum(1),
  volume_compression: new ExpantaNum(1.1),
  min_volume: new ExpantaNum(1E-10),
  pressure: new ExpantaNum(0),
  energy: new ExpantaNum(0),
  prestige_points: new ExpantaNum(0),
  prestige_threshold: new ExpantaNum(150),
  
  p_u1_level: new ExpantaNum(0),
  p_u2_level: new ExpantaNum(0),
  p_u3_state: new ExpantaNum(0)
};

setInterval(function() {
  saveData(data, 'DS-00000005');
  createToast("Auto-Saved successfully!", "toast-success", 2000)
}, 10000);

function getSaveThingOrSomething() {
  var retrievedData = retrieveData('DS-00000005');
  createToast("Game Loaded...", "toast-alert", 1000)
}


function showTab(tabId) {
  var tabs = document.getElementsByClassName('tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('unlocked');
  }

  document.getElementById(tabId).classList.add('unlocked');
}

function tabLogic() {
  document.getElementById('mainTabButton').classList.add('mainTabUnlocked')
  if (data.pressure.gte(1)) {
    document.getElementById('achTabButton').disabled = false;
    document.getElementById('achTabButton').classList.remove('achTabLocked')
    document.getElementById('achTabButton').classList.add('achTabUnlocked')
  }
  else {
    document.getElementById('achTabButton').disabled = true;
    document.getElementById('achTabButton').classList.add('achTabLocked')
  }
  
  if (data.pressure.gte(data.prestige_threshold) || data.prestige_points.gte(0.001)) {
    document.getElementById('prestigeTabButton').disabled = false;
    document.getElementById('prestigeTabButton').classList.remove('prestigeTabLocked')
    document.getElementById('prestigeTabButton').classList.add('prestigeTabUnlocked')
  }
  else {
    document.getElementById('prestigeTabButton').disabled = true;
    document.getElementById('prestigeTabButton').classList.add('prestigeTabLocked')
  }
  
  if (data.energy.gte(100)) {
    document.getElementById('transendanceTabButton').disabled = false;
    document.getElementById('transendanceTabButton').classList.remove('transendanceTabLocked')
    document.getElementById('transendanceTabButton').classList.add('transendanceTabUnlocked')
  }
  else {
    document.getElementById('transendanceTabButton').disabled = true;
    document.getElementById('transendanceTabButton').classList.add('transendanceTabLocked')
  }
  
}

function createToast(message, state, duration) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast", state, "show-toast");
  const flexContainer = document.createElement("div");
  flexContainer.classList.add("flex-container");
  const textSpan = document.createElement("span");
  textSpan.textContent = message;
  textSpan.style.display = "flex";
  textSpan.style.alignItems = "center";


  flexContainer.appendChild(textSpan);
  toast.appendChild(flexContainer);
  toastContainer.appendChild(toast);
  toast.offsetWidth;


  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
  }, duration);
  toast.addEventListener("transitionend", () => {
    toast.remove();
  });
}

function format(input) {
  var x = new ExpantaNum(input)
  
  if (x.gte(999)) {
    let exp = new ExpantaNum.floor(ExpantaNum.log10(x))
    let mant = new ExpantaNum(ExpantaNum.div(x, ExpantaNum.pow(10, exp)))
    return mant.toFixed(3) + " × e" + exp.toFixed(0)
  }
  else if (x.lte(0.001)) {
    let exp = new ExpantaNum.floor(ExpantaNum.log10(x))
    let mant = new ExpantaNum(ExpantaNum.div(x, ExpantaNum.pow(10, exp)))
    return mant.toFixed(3) + " × 0.e" + exp.toFixed(0)
  }
  
  else return x.toFixed(3)
}

