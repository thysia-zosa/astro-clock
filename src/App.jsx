import { Fragment } from "react";
import "./App.css";
import Astrolabe from "./components/Astrolabe/Astrolabe";
import Menu from "./components/Astrolabe/Menu/Menu";

function App() {
  // let time = new Date().getTime() - 946728000000;
  // let t = time / 3155760000000;

  return (
    <Fragment>
      <Astrolabe />
      <Menu />
    </Fragment>
  );
}

export default App;
