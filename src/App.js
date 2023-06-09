import "./App.css";
import * as React from "react";
import { API } from "aws-amplify";
const uuid = require('uuid');

const postEndpoint = async (endpoint, init) => {
  try {
    console.log(`Posting to API endpoint: \"${endpoint}\"`);

    // USAGE: API.post(apiName, path, myInit);
    // I don't know what the actually api is called so this WILL
    // need to be replaced 

    // const apiname = "drinkHistoryHandler";
    const apiname = "savedrinkapi";
    // const apiname = "drink-tracker";

    const response = await API.post(apiname, endpoint, init);
    console.log(`Response from ${endpoint}:`, response);
    return response;

  } catch(error) {
    console.log(`hit an error while querying \"${endpoint}\"`);
    return error;
  }
};

const getNowDateTime = () => {
  return new Date().toISOString().split('T').join(' ').split('Z').join('');
};

const Counter = ({ counter, setCounter, sessionID, setSessionID }) => {
  // every time the counter changes this will run automatically
  React.useEffect(() => {

    const handleEffect = async () => {
      const userID = localStorage.getItem("userid");

      // TODO: delete this eventually, adding error checking to be safe
      if (userID === null || userID === undefined) return;

      if (counter !== 0) {
        if (counter === 1) {
          // First drink, we must add a new session to track it and future drinks
          console.log("First drink, inserting a new session into sessions table...");
          const starttime = getNowDateTime();
          console.log(starttime);

          // Initialize endtime to starttime for now. When the user ends the session, that code will update the value
          const init = {
            body: {
              userid: userID,
              starttime: starttime,
              endtime: starttime,
            },
          };

          console.log("Requesting server to add a new session...");
          const sesh_response = await postEndpoint("/add_session", init); // should return new sessionID that was added
          
          console.log(sesh_response);

          console.log("test 1");
          const drink_init = {
            body: {
              drinkid: counter,

              // TODO get actual id out of sesh_response
              sessionid: "sesh_response",                  
              drink_times: starttime,
            }
          };
          const drink_response = await postEndpoint("/drink_history", drink_init);


          // TODO: if the response is bad, what do we do here? reset counter? 
          // else, we need to setSessionID(sesh_response);
          
        } else {
          const date = getNowDateTime();
          const init = {
            body: {
              drinkid: counter,
              sessionid: sessionID,                  
              drink_times: date,
            },
          };

          // query aws lambda function
          const drink_response = await postEndpoint("/drink_history", init);
        }
      }
    }
    handleEffect();
  }, [counter]);

  return (
    <div id="counter-page">
      <div id="counter-container">
        <p>Drink Count: {counter}</p>
        <button
          id="counter-btn"
          onClick={() => {
            setCounter(counter + 1);
          }}
        >
          add drink
        </button>
      </div>

      <div className="log-options">
        <button
          id="save-btn"
          onClick={() => {
            // TODO: save count to users records

            // reset count
            // api call with /drinkhistory/counter

            setCounter(0);
          }}
        >
          save and reset
        </button>
      </div>

      {counter < 2 ? (
        <div className="alert alert-green">
          <p>You've had less than 2 drinks.</p>
        </div>
      ) : (
        <></>
      )}
      {counter == 2 ? (
        <div className="alert alert-yellow">
          <p>
            Heads up! You've had <b>2</b> drinks already.
          </p>
        </div>
      ) : (
        <></>
      )}
      {counter >= 3 && counter < 5 ? (
        <div className="alert alert-orange">
          <p>
            Maybe slow down? You've had <b>3</b> drinks so far.
          </p>
        </div>
      ) : (
        <></>
      )}
      {counter >= 5 ? (
        <div className="alert alert-red">
          <p>
            {counter < 6 ? (
              <>
                Woah! You've had <b>{counter}</b> drinks.
              </>
            ) : (
              <>Stop drinking.</>
            )}
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const History = () => {


  React.useEffect(() => {
    const userID = localStorage.getItem("userid");
    // TODO: delete this eventually, adding error checking to be safe
    if (userID === null || userID === undefined) return;

    const handleEffect = async () => {
      const init = {
        body: {
          userid: userID,
        }
      };

      console.log("Requesting server to add a new session...");
      const sess_response = await postEndpoint("/get_sessions", init);

      // TODO: for each session create an HTML element for it
      const sessions =  sess_response.

    };

    handleEffect();

  }, []);


  return (
    <div id="counter-page">
      <h3>Alcohol Consumption History</h3>
      <hr />
      history:
    </div>
  );
};

const style = {
  active: { "": "" },
};

const App = () => {
  const [page, setPage] = React.useState("counter");
  const [counter, setCounter] = React.useState(0);
  const [sessionID, setSessionID] = React.useState(null);

  React.useEffect(() => {
    const existingUserID = localStorage.getItem("userid");
    if (existingUserID === undefined || existingUserID === null) {
      
      // create user ID
      localStorage.setItem("userid", uuid.v4());

      // add user ID to rds
      const init = {
        body: {
          userid: localStorage.getItem("userid")
        }
      }
      const response = postEndpoint("/add_user", init);
    }
    console.log("userid:", localStorage.getItem("userid"));
  }, []);
  
  let renderPage;
  switch (page) {
    case "counter":
      renderPage = <Counter 
                      counter={counter} 
                      setCounter={setCounter} 
                      sessionID={sessionID}
                      setSessionID={setSessionID}
                  />;
      break;
    case "history":
      renderPage = <History />;
      break;
    default:
      renderPage = <Counter 
                      counter={counter} 
                      setCounter={setCounter} 
                      sessionID={sessionID}
                      setSessionID={setSessionID}
                  />;
  }

  return (
    <div className="App">
      <nav className="navigation-bar">
        <ul id="nav-links">
          <li
            className={`nav-link ${page == "counter" ? "active-link" : ""}`}
            onClick={() => {
              setPage("counter");
            }}
          >
            Counter
          </li>
          <li
            className={`nav-link ${page === "history" ? "active-link" : ""}`}
            onClick={() => {
              setPage("history");
            }}
          >
            History
          </li>
        </ul>
      </nav>

      <div className="page-container">{renderPage}</div>
    </div>
  );
};

export default App;
