import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import SampleChart from "./SampleChart"
import AptSensorChart from "./AptSensorChart"

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      {/* <div>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
      </div> */}
      <h1>Apartment Temps</h1>
      <div className="card">
        {/* <SampleChart /> */}
        <AptSensorChart />
      </div>
    </div>
  );
}

export default App;
