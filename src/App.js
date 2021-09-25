import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Authentication from "./components/authentication";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  return (
    <BrowserRouter>
      <Provider store={store}>
        <Authentication />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
