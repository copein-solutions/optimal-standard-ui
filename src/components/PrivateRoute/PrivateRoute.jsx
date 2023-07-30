import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import { api, fetchHeaders } from "../../services/ApiService";
import { CustomSkeleton } from "../skeleton/Skeleton";

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const PING = "/ping";

  useEffect(() => {
    const headers = fetchHeaders();
    if (headers) {
      api
        .get(PING, headers)
        .then((response) => {
          setIsLoggedIn(true);
          dispatch({ type: "LOGIN", payload: true });
        })
        .catch((error) => {
          setIsLoggedIn(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <CustomSkeleton/>;
  }
  
  const redirect = () => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return redirect();
};

export default PrivateRoute;
