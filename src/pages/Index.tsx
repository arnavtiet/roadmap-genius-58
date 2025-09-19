import { Dashboard } from "@/components/Dashboard";
import Login from "./Login";
import { useState } from "react";

const Index = () => {
const [isLoggedIn, setIsLoggedIn] = useState(true);
const [currentUser, setCurrentUser] = useState<string | null>(null);
 return (
    <>
      {isLoggedIn  ? (
        <Dashboard  />
      ) : (
        <Login/>
      )}
    </>
 );
};

export default Index;
