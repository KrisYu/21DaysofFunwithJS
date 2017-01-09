
function Stopwatch(elem,workTimer){

  var stopTime = workTimer * 1000 + new Date().getTime();
  var interval;

  function update(){
    var remainingSeconds = (stopTime - (new Date().getTime())) / 1000;

    if (remainingSeconds > 0) {
      var minutes, seconds;
      minutes = parseInt(remainingSeconds / 60);
      seconds = parseInt(remainingSeconds % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      console.log(minutes, seconds);
      elem.textContent = minutes + " : " + seconds;
    } else{
      clearInterval(interval);
      soundAlarm();
      interval = null;
      elem.textContent = "🍅";
      isOn = false;
    }
  }

  function soundAlarm(){
    var alram = new Audio('beepbeep.mp3');
    alram.play();
  }



  this.isOn = false;
  this.start = function(){
    if (!this.isOn) {
      interval = setInterval(update, 10);
      this.isOn = true;
    }
  };

  this.stop = function(){
    if (this.isOn) {
      clearInterval(interval);
      interval = null;
      this.isOn = false;
    }
  };

  this.reset = function(){
    time = 0;
  };

};
console.log('hi');
