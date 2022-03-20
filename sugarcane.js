let table = document.getElementById('land');
let wateredCountContainer = document.getElementById('watered-count');
let sugarCountContainer = document.getElementById('sugar-count');
let lossCountContainer = document.getElementById('loss-count');

let lossTogg = document.getElementById('loss-togg');

var h1 = ((ihl = localStorage.getItem('hide-loss')) === null) ? 1 : Number(ihl);

if (h1 === 0) {
  document.body.classList.remove('hide-loss');
  lossTogg.classList.remove('opac');
}

lossTogg.addEventListener('click', function (e){
  if (h1 === 1) {
    localStorage.setItem('hide-loss', 0);
    document.body.classList.remove('hide-loss');
    lossTogg.classList.remove('opac');
    h1 = 0;
  } else {
    localStorage.setItem('hide-loss', 1);
    document.body.classList.add('hide-loss');
    lossTogg.classList.add('opac');
    h1 = 1;
  }
})


const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop)
});

function zoomOut() {
  let zoomlvl = Number(table.getAttribute('zoom'));
  if (zoomlvl > -4) table.setAttribute('zoom', zoomlvl-1)
}

function zoomIn() {
  let zoomlvl = Number(table.getAttribute('zoom'));
  if (zoomlvl < 4) table.setAttribute('zoom', zoomlvl+1)
}

function getDimension() {
  while (true) {
    let dx = Number(prompt('직사각형의 가로는 얼마입니까? (1 이상 99 이하의 자연수)'));
    if (!dx) return false;
    if (typeof dx === 'number' && dx > 0 && dx < 100 && dx % 1 === 0) {
      let dy = Number(prompt('세로는 몇입니까? (1 이상 99 이하의 자연수)'));
      if (!dy) return false;
      if (typeof dy === 'number' && dy > 0 && dy < 100 && dy % 1 === 0) {
        return [dx, dy];
      }
    }
  }
}

let pn = Number(params.n);
var n = (pn !== undefined && pn > 0 && pn < 100 & pn % 1 === 0) ? pn : 7;

let pm = Number(params.m);
var m = (pm !== undefined && pm > 0 && pm < 100 & pm % 1 === 0) ? pm : 7;

function getCell(x, y) {
  if (x > -1 && x < n && y > -1 && y < m) return table.rows[y].cells[x];
  else return undefined;
}

function isWatered(x, y) {
  let el = getCell(x, y);
  if (el === undefined) return false;
  return el.classList.contains('watered');
}

function isSugar(x, y) {
  let el = getCell(x, y);
  if (el === undefined) return false;
  return el.classList.contains('sugar') && !el.classList.contains('watered');
}

function isAdjacentToWater(x, y) {
  if (isWatered(x-1, y)) return true;
  if (isWatered(x+1, y)) return true;
  if (isWatered(x, y-1)) return true;
  if (isWatered(x, y+1)) return true;
  return false;
}

function adjacentWater(x, y) {
  let counter = 0;
  if (isWatered(x-1, y)) counter++;
  if (isWatered(x+1, y)) counter++;
  if (isWatered(x, y-1)) counter++;
  if (isWatered(x, y+1)) counter++;
  return counter > 0 ? counter + 1 : 0;
}

function adjacentSugar(x, y) {
  let counter = 0;
  if (isSugar(x-1, y)) counter++;
  if (isSugar(x+1, y)) counter++;
  if (isSugar(x, y-1)) counter++;
  if (isSugar(x, y+1)) counter++;
  return counter;
}

function adjacentVoid(x, y) {
  let counter = 0;
  if (x === 0) counter++;
  if (x === n-1) counter++;
  if (y === 0) counter++;
  if (y === n-1) counter++;
  return counter;
}

function updateText(x, y) {
  let el = getCell(x, y);
  if (el !== undefined) {
    el.innerHTML = String(adjacentWater(x, y) + adjacentSugar(x, y) + adjacentVoid(x, y));
  }
  return;
}

var water = function(e) {
  let x = Number(e.target.getAttribute('x'));
  let y = Number(e.target.getAttribute('y'));
  let isTWatered = isWatered(x, y);
  e.target.classList.toggle('watered');
  getCell(x-1, y)?.classList[isTWatered && !isAdjacentToWater(x-1, y) ? 'remove' : 'add']('sugar');
  getCell(x+1, y)?.classList[isTWatered && !isAdjacentToWater(x+1, y) ? 'remove' : 'add']('sugar');
  getCell(x, y-1)?.classList[isTWatered && !isAdjacentToWater(x, y-1) ? 'remove' : 'add']('sugar');
  getCell(x, y+1)?.classList[isTWatered && !isAdjacentToWater(x, y+1) ? 'remove' : 'add']('sugar');
  let waterCount = document.getElementsByClassName('watered').length;
  let sugarCount = document.getElementsByClassName('sugar').length - document.getElementsByClassName('sugar watered').length;
  let tLoss = 4 * waterCount - sugarCount
  wateredCountContainer.innerHTML = waterCount;
  sugarCountContainer.innerHTML = sugarCount;
  lossCountContainer.innerHTML = tLoss;
  updateText(x, y+2);
  updateText(x-1, y+1);
  updateText(x, y+1);
  updateText(x+1, y+1);
  updateText(x-2, y);
  updateText(x-1, y);
  updateText(x, y);
  updateText(x+1, y);
  updateText(x+2, y);
  updateText(x-1, y-1);
  updateText(x, y-1);
  updateText(x+1, y-1);
  updateText(x, y-2);
}

function createTable(dx, dy) {
  table.innerHTML = '';
  wateredCountContainer.innerHTML = 0;
  sugarCountContainer.innerHTML = 0;
  lossCountContainer.innerHTML = 0;
  for (var i = 0; i < dy; i++) {
    let row = document.createElement('tr');
    for (var j = 0; j < dx; j++) {
      let cell = document.createElement('td');
      cell.addEventListener('click', water);
      cell.setAttribute('x', j);
      cell.setAttribute('y', i);
      let l;
      if (i === 0 || i === dy - 1) {
        if (j === 0 || j === dx - 1) {
          l = 2;
        } else {
          l = 1;
        }
      } else if (j === 0 || j === dx - 1) {
        l = 1;
      } else {
        l = 0
      }
      let textNode = document.createTextNode(l);
      cell.appendChild(textNode);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

createTable(n, m);
