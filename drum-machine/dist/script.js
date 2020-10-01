var dict = {
  81: 'Q',
  87: 'W',
  69: 'E',
  65: 'A',
  83: 'S',
  68: 'D',
  90: 'Z',
  88: 'X',
  67: 'C' };


document.addEventListener('keyup', function (event) {
  if (dict[event.which]) {
    document.getElementById(dict[event.which]).play();
  }
});

function disp(a) {
  document.getElementById("display").innerHTML = a;
}