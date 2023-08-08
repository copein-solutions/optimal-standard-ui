import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store/store";
import {
  APPLICATION_AREA_CREATE,
  APPLICATION_AREA_EDIT,
  APPLICATION_AREA_LIST, LOGIN,
  MATERIAL_CREATE,
  MATERIAL_EDIT,
  MATERIAL_LIST, SYSTEM_CREATE, SYSTEM_EDIT, SYSTEM_LIST
} from "./utils/constants";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/login/login";
import AddMaterial from "./pages/material/addMaterial";
import ListMaterial from "./pages/material/listMaterial";
import EditMaterial from "./pages/material/editMaterial";
import AddApplicationArea from "./pages/applicationArea/addApplicationArea";
import ListApplicationArea from "./pages/applicationArea/listApplicationArea";
import EditApplicationArea from "./pages/applicationArea/editApplicationArea";
import AddSystem from "./pages/system/addSystem";
import ListSystem from "./pages/system/listSystem";
import EditSystem from "./pages/system/editSystem";

const privateRoutes = [
  {
    path: MATERIAL_CREATE,
    component: <AddMaterial/>
  },
  {
    path: MATERIAL_LIST,
    component: <ListMaterial/>
  },
  {
    path: MATERIAL_EDIT,
    component: <EditMaterial/>
  },
  {
    path: APPLICATION_AREA_CREATE,
    component: <AddApplicationArea/>
  },
  {
    path: APPLICATION_AREA_LIST,
    component: <ListApplicationArea/>
  },
  {
    path: APPLICATION_AREA_EDIT,
    component: <EditApplicationArea/>
  },
  {
    path: SYSTEM_CREATE,
    component: <AddSystem/>
  },
  {
    path: SYSTEM_EDIT,
    component: <EditSystem/>
  },
  {
    path: SYSTEM_LIST,
    component: <ListSystem/>
  }
];

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={store}>
      <Router>
        <App/>
        <Routes>
          {/* Public route */}
          <Route
              path={LOGIN}
              element={
                <Login/>
              }
          ></Route>
          {/* Default route */}
          <Route
              path="/*"
              element={
                <Navigate to="/login"/>
              }
          />
          {privateRoutes.map((option, index) => (
              <Route key={index} path={option.path} element={<PrivateRoute>{option.component}</PrivateRoute>}/>
          ))}
        </Routes>
      </Router>
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
