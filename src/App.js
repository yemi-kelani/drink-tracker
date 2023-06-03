import './App.css';

import * as React from "react";

const Counter = ({ counter, setCounter }) => {
  return (
    <div id="counter-page">

      <div id="counter-container">
        <p>Drink Count: {counter}</p>
        <button 
          id="counter-btn"
          onClick={
            () => {
              setCounter(counter + 1);
            }
          }>
          add drink
        </button>
      </div>

      <div className="log-options">
        <button 
          id="reset-btn"
          onClick={() => {
            setCounter(0);
          }}>
          reset counter
        </button>
        <button 
          id="save-btn"
          onClick={() => {
            // TODO: save count to users records

            // reset count
            setCounter(0);
          }}>
          save and reset
        </button>
      </div>

      {
        counter < 2 ? 
        <div className="alert alert-green">
          <p>You've had less than 2 drinks.</p>
        </div> 
        : <></>
      }
      {
        counter == 2 ? 
        <div className="alert alert-yellow">
          <p>Heads up! You've had <b>2</b> drinks already.</p>
        </div> 
        : <></>
      }
      {
        counter >= 3 && counter < 5 ? 
        <div className="alert alert-orange">
          <p>
            Maybe slow down? You've had <b>3</b> drinks so far.
          </p>
        </div> 
        : <></>
      }
      {
        counter >= 5 ? 
        <div className="alert alert-red">
          <p>
            {
              counter < 6 ?
              <>Woah! You've had <b>{counter}</b> drinks.</>
              : <>Stop drinking.</>
            }
          </p>
        </div> 
        : <></>
      }

    </div>
  )
}

const History = () => {
  return (
    <div id="counter-page">
      <h3>Alcohol Consumption History</h3>
      <hr/>
      history:
      

      
    </div>
  )
}

const style = {
  "active": {"": ""}
}
 
const App = () => {
  const [page, setPage] = React.useState("counter");
  const [counter, setCounter] = React.useState(0);

  let renderPage;
  switch(page) {
    case "counter":
      renderPage = <Counter counter={counter} setCounter={setCounter}/>;
      break;
    case "history":
      renderPage = <History/>;
      break;
    default:
      renderPage = <Counter counter={counter} setCounter={setCounter}/>;
  }

  return (
    <div className="App">
      
      <nav className="navigation-bar">
        <ul id="nav-links">
          <li
            className={`nav-link ${page == "counter" ? "active-link" : ""}`} 
            onClick={() => {setPage("counter")}}
          >Counter</li>
          <li
            className={`nav-link ${page == "history" ? "active-link" : ""}`} 
            onClick={() => {setPage("history")}}
          >History</li>
        </ul>
      </nav>

      <div className="page-container">
        {renderPage}
      </div>

    </div>
  );
}

export default App;
