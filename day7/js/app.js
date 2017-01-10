
// State:
// 0: Initial state
// 1: Paused
// 2: Running a pomodoro cycle
// 3: Running a break cycle
// 4: Running a long break

var Pomodoro = function(pomodoroTime, breakTime, longBreakTime, longBreakCnt, displayElementId, messageDisplayId, countsDisplayId){
  this.cycle = pomodoroTime * 60 ;
  this.break = breakTime * 60; // minutes
  this.longBreak = longBreakTime * 60;
  this.longBreakCnt = longBreakCnt;
  this.state = 0 ; // Initial state.
  this.lastState = 2; //
  this.timeLeft = pomodoroTime * 60;
  this.timerDisplay = displayElementId;
  this.messageDisplayId = messageDisplayId;
  this.countsDisplayId = countsDisplayId;
  this.pomodoroCnt = 0; // how many pomodoro passed

  document.getElementById(this.timerDisplay).innerHTML = pomodoroTime + ':00';
}


Pomodoro.prototype.start = function(){
  var self = this;
  if (this.state == 0 || this.state == 1) {
    this.newState(this.lastState);
    tick();
    this.timer = setInterval(function(){
      tick();
    },1000);
  }

  function tick(){
    self.timeLeft = self.timeLeft - 1;
    self.updateDisplay(self.timeLeft);
    if (self.timeLeft == 0) {
      // entering next state
      if (self.state == 2) {
        self.pomodoroCnt++;
        // used to display
        document.getElementById(self.countsDisplayId).innerHTML = self.pomodoroCnt + ' / 10';
        if (self.pomodoroCnt % self.longBreakCnt == 0 ) {
          self.timeLeft = self.longBreak;
          self.state = 4;
        } else {
          self.timeLeft = self.break;
          self.state = 3;
        }
      } else {
        self.timeLeft = self.cycle;
        self.state = 2;
      }
      self.newState(self.state);
      console.log('cycle ended');
      var audio = new Audio('beepbeep.mp3');
      audio.play();
      self.pause();
    }
  }
}


Pomodoro.prototype.pause = function(){
  if (this.state == 2 || this.state == 3 || this.state == 4) {
    this.newState(1);
    clearInterval(this.timer);
  }
}

Pomodoro.prototype.reset = function(){
  this.newState(0);
  this.timeLeft = this.cycle;
  clearInterval(this.timer);
  this.updateDisplay(this.timeLeft);
}

Pomodoro.prototype.updateDisplay = function(time, message){
  document.getElementById(this.timerDisplay).innerHTML = getFormattedTime(time);

  if (message) {
    document.getElementById(this.messageDisplayId).innerHTML = message;
  }

  function getFormattedTime(seconds){
    var minsLeft = Math.floor(seconds / 60);
        secondsLeft = seconds - (minsLeft * 60);

    return zeroPad(minsLeft) + ':' + zeroPad(secondsLeft);

    function zeroPad(number){
      return number < 10 ? '0' + number : number;
    }
  }
}

Pomodoro.prototype.newState = function(state){
  this.lastState = this.state;
  this.state = state;
  var message;
  switch (state) {
    case 0:
      this.lastState = 2;
      console.log('New state set: Initial state');
      message = 'Click on play to start!'
      document.getElementById(this.timerDisplay).style.color = '#f67d76';
      break;
    case 1:
      console.log('New sate set: Paused');
      message = 'Paused';
      document.getElementById(this.timerDisplay).style.color = '#CED073';
      break;
    case 2:
      console.log('New state set: Pomodoro Cycle');
      message = 'WORK WORK!';
      document.getElementById(this.timerDisplay).style.color = '#f67d76';
      break;
    case 3:
      console.log('New state set: Break Cycle');
      message = 'STAND UP!';
      document.getElementById(this.timerDisplay).style.color = '#53C56C';
      break;
    case 4:
      console.log('New state set: Long Break Cycle');
      message = 'WALK AROUND!';
      document.getElementById(this.timerDisplay).style.color = '#53C56C';
      break;
  }
  this.updateDisplay(this.timeLeft, message);
}


var elStart = document.getElementById('start');
    elPause = document.getElementById('pause');
    elReset = document.getElementById('reset');

var myPomodoro = new Pomodoro(25, 5, 15, 4, 'timer', 'messageDisplayId', 'counts');

elStart.addEventListener('click',function(){
  myPomodoro.start();
});

elPause.addEventListener('click',function(){
  myPomodoro.pause();
});

elReset.addEventListener('click',function(){
  myPomodoro.reset();
});
