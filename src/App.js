import React from "react";
import Authentication from "./components/authentication";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { BrowserRouter, Switch } from "react-router-dom";

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Authentication />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
