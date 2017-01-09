var timer = document.getElementById('timer');
var toggleBtn = document.getElementById('toggle');
var resetBtn  = document.getElementById('reset');

var workTimer = 1 * 60;
var watch = new Stopwatch(timer,workTimer);

toggleBtn.addEventListener('click',function(){
  if (watch.isOn) {
    watch.stop();
  }else{
    watch.start();
  }
});

resetBtn.addEventListener('click',function(){
  watch.reset();
});
