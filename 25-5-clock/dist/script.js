// Accurate_Interval.js 
// Thanks Squeege! For the elegant answer provided to this question: 
// http://stackoverflow.com/questions/8173580/setinterval-timing-slowly-drifts-away-from-staying-accurate
// Github: https://gist.github.com/Squeegy/1d99b3cd81d610ac7351
// Slightly modified to accept 'normal' interval/timeout format (func, time). 

(function () {
  window.accurateInterval = function (fn, time) {
    var cancel, nextAt, timeout, wrapper;
    nextAt = new Date().getTime() + time;
    timeout = null;
    wrapper = function () {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return fn();
    };
    cancel = function () {
      return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
      cancel: cancel };

  };
}).call(this);
// 25 minutes from now
var time_in_minutes = 25;
var current_time = Date.parse(new Date());
var deadline = new Date(current_time + time_in_minutes * 60 * 1000);

function decrement(a) {
  if (document.getElementById(a).innerHTML > 1) {
    document.getElementById(a).innerHTML--;
  }
  if (paused == true) {
    reset_clock(document.getElementById('session-length').innerHTML, document.getElementById('break-length').innerHTML);
  }
}

function increment(a) {
  if (document.getElementById(a).innerHTML < 60) {
    document.getElementById(a).innerHTML++;
  }
  if (paused == true) {
    reset_clock(document.getElementById('session-length').innerHTML, document.getElementById('break-length').innerHTML);
  }
}

function time_remaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor(t / 1000 % 60);
  var minutes = Math.floor(t / 1000 / 60);
  var hours = Math.floor(t / (1000 * 60 * 60) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return { 'total': t, 'days': days, 'hours': hours, 'minutes': minutes, 'seconds': seconds };
}

var timeinterval;
function run_clock(id, endtime) {
  var clock = document.getElementById(id);
  function update_clock() {
    var t = time_remaining(endtime);
    t.seconds = t.seconds < 10 ? "0" + t.seconds : t.seconds;
    t.minutes = t.minutes < 10 ? "0" + t.minutes : t.minutes;
    clock.innerHTML = t.minutes + ':' + t.seconds;
    if (t.total <= 0) {
      document.getElementById('beep').play();

      if (document.getElementById('timer-label').innerHTML.includes('Session')) {
        document.getElementById('timer-label').innerHTML = document.getElementById('timer-label').innerHTML.replace('Session', 'Break');
        reset_clock(document.getElementById('session-length').innerHTML, document.getElementById('break-length').innerHTML);
        resume_clock();
      } else

      {
        document.getElementById('timer-label').innerHTML = document.getElementById('timer-label').innerHTML.replace('Break', 'Session');
        reset_clock(document.getElementById('session-length').innerHTML, document.getElementById('break-length').innerHTML);
      }
      resume_clock();
    }
  }
  update_clock(); // run function once at first to avoid delay
  timeinterval = setInterval(update_clock, 1000);
}
run_clock('time-left', deadline);

var paused = false; // is the clock paused?
time_orig = time_remaining(deadline).total;
pause_clock();

function hard_reset_clock() {
  document.getElementById('beep').pause();
  document.getElementById('beep').currentTime = 0;
  if (document.getElementById('timer-label').innerHTML.includes('Break')) {
    document.getElementById('timer-label').innerHTML = document.getElementById('timer-label').innerHTML.replace('Break', 'Session');}
  reset_clock(25, 5);
}

function reset_clock(a, b) {
  paused = true;
  clearInterval(timeinterval); // stop the clock
  if (document.getElementById('timer-label').innerHTML.includes('Session')) {
    time_left = time_orig * (a / 25);} else
  {time_left = time_orig * (b / 25);} // preserve remaining time

  document.getElementById('session-length').innerHTML = a;
  document.getElementById('break-length').innerHTML = b;
  deadline = new Date(Date.parse(new Date()) + time_left);
  paused = false;
  run_clock('time-left', deadline);
  pause_clock();
}

function pause_clock() {
  if (!paused) {
    paused = true;
    clearInterval(timeinterval); // stop the clock
    time_left = time_remaining(deadline).total; // preserve remaining time
  }
}

function resume_clock() {
  if (paused) {
    paused = false;

    // update the deadline to preserve the amount of time remaining
    deadline = new Date(Date.parse(new Date()) + time_left);

    // start the clock
    run_clock('time-left', deadline);
  }
}

function startStop() {
  if (paused) {resume_clock();} else
  {pause_clock();}
}