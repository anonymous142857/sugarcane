let table = document.getElementById('land');
let wateredCountContainer = document.getElementById('watered-count');
let sugarCountContainer = document.getElementById('sugar-count');
let lossCountContainer = document.getElementById('loss-count');

function getN() {
  while (true) {
    let k = Number(prompt('몇 곱하기 몇 정사각형입니까? (1 이상 99 이하의 자연수)'));
    if (!k) {
      return false;
    }
    if (typeof k === 'number' && k > 0 && k < 100 && k % 1 === 0) {
      return k;
    }
  }
}

var n = 7;

function getCell(x, y) {
  if (x > -1 && x < n && y > -1 && y < n) return table.rows[y].cells[x];
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

function createTable(m) {
  table.innerHTML = '';
  wateredCountContainer.innerHTML = 0;
  sugarCountContainer.innerHTML = 0;
  lossCountContainer.innerHTML = 0;
  for (var i = 0; i < m; i++) {
    let row = document.createElement('tr');
    for (var j = 0; j < m; j++) {
      let cell = document.createElement('td');
      cell.addEventListener('click', water);
      cell.setAttribute('x', j);
      cell.setAttribute('y', i);
      let l;
      if (i === 0 || i === m - 1) {
        if (j === 0 || j === m - 1) {
          l = 2;
        } else {
          l = 1;
        }
      } else if (j === 0 || j === m - 1) {
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

createTable(n);
