import "./App.css";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import {
  APPLICATION_AREA_CREATE,
  APPLICATION_AREA_EDIT,
  APPLICATION_AREA_LIST,
  LOGIN,
  MATERIAL_CREATE,
  MATERIAL_EDIT,
  MATERIAL_LIST,
  SYSTEM_CREATE,
  SYSTEM_EDIT,
  SYSTEM_LIST,
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
    component: <AddMaterial />,
  },
  {
    path: MATERIAL_LIST,
    component: <ListMaterial />,
  },
  {
    path: MATERIAL_EDIT,
    component: <EditMaterial />,
  },
  {
    path: APPLICATION_AREA_CREATE,
    component: <AddApplicationArea />,
  },
  {
    path: APPLICATION_AREA_LIST,
    component: <ListApplicationArea />,
  },
  {
    path: APPLICATION_AREA_EDIT,
    component: <EditApplicationArea />,
  },
  {
    path: SYSTEM_CREATE,
    component: <AddSystem />,
  },
  {
    path: SYSTEM_EDIT,
    component: <EditSystem />,
  },
  {
    path: SYSTEM_LIST,
    component: <ListSystem />,
  },
];

export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public route */}
          <Route path={LOGIN} element={<Login />}></Route>
          {/* Default route */}
          <Route path="/*" element={<Navigate to="/login" />} />
          {privateRoutes.map((option, index) => (
            <Route
              key={index}
              path={option.path}
              element={<PrivateRoute>{option.component}</PrivateRoute>}
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}
