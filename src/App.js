import './App.css';
import 'materialize-css/dist/css/materialize.min.css';
import {useState} from 'react'

function App() {

const [breakTime, setBreaktime] = useState(5*60);
const [sessionTime, setSessionTime] = useState(25*60);
const[displayTime, setDisplayTime] = useState(25*60);
const [timerOn, setTimerOn] = useState(false);
const [onBreak, setOnBreak] = useState(false);
const [breakAudio, setBreakAudio] = useState(new Audio('./breakaudio.mp3'))

const breakSound = () => {
  breakAudio.currentTime = 0;
  breakAudio.play();
}


const formatTime = (time) => {
  let minutes = Math.floor(time/60);
  let seconds = time % 60;
  return (minutes < 10 ? "0" + minutes: minutes) + ":" + ((seconds < 10 ? "0" + seconds: seconds));
}

const changetime = (amount, type) => {
if (type === 'break'){
  if (breakTime <= 60 && amount < 0){
    return;
  }
  setBreaktime((previous) => previous + amount)

}
else if (type === 'session'){
  if (sessionTime <= 60 && amount < 0){
    return;
  }
  setSessionTime((previous) => previous + amount);
  if(!timerOn){
    setDisplayTime(sessionTime  + amount);
  }
}
};

const control = () => {
  let second = 1000;
  let date = new Date().getTime();
  let nextDate = new Date().getTime() + second;
  let onBreakLet = onBreak;
  if (!timerOn) {
    let interval = setInterval(() => {
      date = new Date().getTime();
      if(date > nextDate){
        setDisplayTime((previous) => {
          if(previous <= 0 && !onBreakLet){
            breakSound();
            onBreakLet = true;
            setOnBreak(true);
            return breakTime;
          } else if(previous <= 0 && onBreakLet){
            breakSound();
            onBreakLet = false;
            setOnBreak(false);
            return breakTime;
          }
          return previous - 1
        });
nextDate += second;
      }
    }, 30)
    localStorage.clear();
    localStorage.setItem('interval-id', interval)
  }

if (timerOn) {
  clearInterval(localStorage.getItem('interval-id'))
}

  setTimerOn(!timerOn);
};

const reset = () => {
  setDisplayTime(25*60);
  setBreaktime(5*60);
  setSessionTime(25*60);
};


  return (
    <div className="App center-align">
      <h1 id="title">25 + 5 Clock</h1>
      <div className='dual-container'>
        <div id="break-label">
      <Length title={"break Length"} changetime={changetime} type={"break"} time={breakTime} formatTime={formatTime}></Length>
      </div>
      <div id="session-label">
      <Length title={"Session Length"} changetime={changetime} type={"session"} time={sessionTime} formatTime={formatTime}></Length>
      </div>
      </div>
      <div id="id">
      <h2>{onBreak ? "break" : "session"}</h2>
      <h1 id="session-length timer-label break-length time-left">{formatTime(displayTime)}</h1>
      <button id="start_stop" className='btn-large deep-red lighten-4' onClick={control}>
        {timerOn ? (<i className='material-icons'>pause_circle_filled</i>): (<i className='material-icons'>play_circle_filled</i>)}
        </button>
        <button id="reset" className='btn-large deep-red lighten-4' onClick={reset}>
          <i className='material-icons'>settings_backup_restore</i>
        </button>
        </div>
    </div>
  );
}

function Length ({title, changetime, type, time, formatTime}){
  return(
    <div>
    
      <h3>{title}</h3>
      <div className='time-set'>
      <button id="session-increment break-increment" className='btn-small deep-red lighten-4'  onClick={() => changetime(-60, type)}>
       
        <i className='material-icons'>arrow_downward</i>
      </button>
      <h3>{formatTime(time)}</h3>
      <button id="session-decrement break-decrement" className='btn-small deep-red lighten-4' onClick={() => changetime(60, type)}>
        <i className='material-icons'>arrow_upward</i>
      </button>
      </div>
    </div>
  )
}
export default App;
