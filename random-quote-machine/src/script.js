var textArray = [
    'song1.ogg',
    'song2.ogg'
];

function disp() {
  var randomNumber = Math.floor(Math.random()*textArray.length);
  document.getElementById("text").innerHTML = textArray[randomNumber];
    var randomNumber = Math.floor(Math.random()*textArray.length);
  document.getElementById("author").innerHTML = textArray[randomNumber]; 
}