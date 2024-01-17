function showTab(tabId) {
  var tabs = document.getElementsByClassName('tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('unlocked');
  }

  document.getElementById(tabId).classList.add('unlocked');
}

/*function tabLogic() {
  if (plr.scalar.gte(10)) {
    document.getElementById('hydrogenTabButton').disabled = false;
  } else {
    document.getElementById('hydrogenTabButton').disabled = true;
  }
}*/