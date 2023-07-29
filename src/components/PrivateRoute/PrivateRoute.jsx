import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {  
  const isAuthenticated = useSelector(state => state.logged)
  const credentials = localStorage.getItem('credentials')
  const dispatch = useDispatch();
  const [isLogged, setLogged] = useState(false);
  if (!isAuthenticated && credentials != null) {
      dispatch({ type: "LOGIN", payload: true });
      setLogged(true);
  }
  if (!isAuthenticated && !isLogged) {
    return <Navigate to='/login' replace={true} />
  }    
  return children
}

export default PrivateRoute
