import './App.css';

import * as React from "react";

const Counter = ({ counter, setCounter }) => {
  return (
    <div id="counter-page">

      <p>count {counter}</p>

      <button 
        id="counter-btn"
        onClick={
          () => {
            setCounter(counter + 1);
          }
        }>
        add drink
      </button>

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
            className="nav-link" 
            onClick={() => {setPage("counter")}}
          >Counter</li>
          <li
            className="nav-link" 
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
