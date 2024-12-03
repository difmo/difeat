import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";  
import { UserProvider } from "./utils/userContext";
import store from "./utils/store";  

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>  
    <UserProvider>           
      <App />
    </UserProvider>
  </Provider>
);
