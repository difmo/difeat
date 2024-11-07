import { createContext } from "react";

const userContext = createContext({
  user: null, 
  setUser: () => {}, 
});

userContext.displayName = "userContext";

export default userContext;
