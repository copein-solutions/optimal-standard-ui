import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const user = useSelector(state => {
    let nose = state.logged
    return nose
  })
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return children
}

export default PrivateRoute
