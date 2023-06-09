import "./App.css";
import * as React from "react";
import {Amplify, API} from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const apiname = "drinktrackerapi";
const uuid = require('uuid');

// const API = "https://5zagbx91fe.execute-api.us-east-2.amazonaws.com/test"

// HELPER FUNCTIONS ==============================================================================================
const postEndpoint = async (endpoint, init) => {
  try {
    
    const response = await API.post(apiname, endpoint, JSON.stringify(init));
    console.log(response);
    return response;

  } catch (error) {
    console.log(`hit an error while querying "${endpoint}"`);
    console.log("Error:", error);
    return error;
  }
};

const getNowDateTime = () => {
  return new Date().toISOString().split('T').join(' ').split('Z').join('');
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

// COMPONENTS ====================================================================================================
const Counter = ({ counter, setCounter}) => {
  // every time the counter changes this will run automatically
  React.useEffect(() => {

    const handleEffect = async () => {
      const userID = localStorage.getItem("userid");
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

          console.log("userID for session", userID);

          console.log("Requesting server to add a new session...");
          const response = await postEndpoint("/add-session", init); // should return new sessionID that was added
          
          
          // const lastInsertID = parseInt(response.json()["body"]);
          // console.log("lastInsertID", lastInsertID)
          

          // Reset drinkTimes state variable for new session
          localStorage.setItem("timestamps", [starttime]);

          // const drink_init = {
          //   body: {
          //     sessionid: localStorage.getItem("sessionID"),
          //     drink_time: starttime,
          //   }
          // };
          // const drink_response = await postEndpoint("/add-drink", drink_init);
        } else {
          const drinkTimeStamp = getNowDateTime();
          const timestamps = localStorage.getItem("timestamps");
          localStorage.setItem("timestamps", [...timestamps, drinkTimeStamp]);
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
      {counter === 2 ? (
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

const History = ({ sessions, setSessions }) => {


  React.useEffect(() => {
    const userID = localStorage.getItem("userid");
    // TODO: delete this eventually, adding error checking to be safe
    if (userID === null || userID === undefined || true) return;

    const handleEffect = async () => {
      // const init = {
      //   body: {
      //     userid: userID,
      //   }
      // };

      // console.log("Requesting server for all sessions...");
      // const sess_response = await postEndpoint("/get-sessions", init);
      // if(sess_response.statusCode !== 200)
      // {
      //   throw new Error("Issue requesting server for all sessions associated with user ", userID);
      // }

      // TODO: proccess sess_response to get list of sessions
      // const sessions = sess_response.body;
      const seshes = [
        {
          sessionid: 0,
          userid: userID,
          starttime: "2023-06-09 17:12:31.195",
          endtime: "2023-06-09 17:12:31.195",
        },
        {
          sessionid: 1,
          userid: userID,
          starttime: "2023-06-09 17:12:31.195",
          endtime: "2023-06-09 17:12:31.195",
        },
      ];

      await setSessions(seshes);

      // TODO: for each session create an HTML element for it


    };

    handleEffect();

  }, []);


  return (
    <div id="counter-page">
      <h3>Alcohol Consumption History</h3>
      <hr />
      <p>History:</p>
      {sessions && sessions.map((session) => (
        <div key={session.sessionid}>
          <p>Start Time: {session.starttime}</p>
          <p>End Time: {session.endtime}</p>
        </div>
      ))}
    </div>
  );
};

const style = {
  active: { "": "" },
};

// APP ===========================================================================================================
const App = () => {
  const [page, setPage] = React.useState("counter");
  const [counter, setCounter] = React.useState(0);
  const [sessions, setSessions] = React.useState([]);

  React.useEffect(() => {
    const existingUserID = localStorage.getItem("userid");

    // TODO: change this if statement back!
    if (existingUserID === undefined || existingUserID === null || true) {

      // create user ID
      var userid = getRandomInt(0, 50000);
      localStorage.setItem("userid", userid);

      // add user ID to rds
      const init = {
        body: {
          userid: localStorage.getItem("userid")
        }
      }
      const response = postEndpoint("/add-user", init);
      if (response.statusCode === 400) {
        throw new Error("userid could not be added to the database!");
      }
      
    }
    console.log("userid:", localStorage.getItem("userid"));

  }, []);

  let renderPage;
  switch (page) {
    case "counter":
      renderPage = <Counter
        counter={counter}
        setCounter={setCounter}
      />;
      break;
    case "history":
      renderPage = <History 
        sessions={sessions}
        setSessions={setSessions}
      />;
      break;
    default:
      renderPage = <Counter
        counter={counter}
        setCounter={setCounter}
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
