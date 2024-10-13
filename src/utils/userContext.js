import { createContext } from "react";

const userContext = createContext({
   user: {
    name: "Hitesh kumar",
    email: "info@difmo.com",
}
});

userContext.displayName = "userContext"; // ye name react developer tools me show hoga in components

export default userContext;