import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import { api, fetchHeaders } from "../../services/ApiService";
import { CustomSkeleton } from "../skeleton/Skeleton";
import Unauthorized from "../Unauthorized/unautorized";

type PrivateRouteProps = {
  children: any,
  allowRoles?: any,
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userRole = localStorage.getItem("userRole");
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

  if (isLoggedIn && allowRoles.includes(userRole))
    return children;
  else if (!isLoggedIn)
    return <Navigate to="/login" />
  else if (isLoggedIn && !allowRoles.includes(userRole))
    return <Unauthorized />
};

export default PrivateRoute;
