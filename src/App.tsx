import "./App.css";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import {
  ADMIN_ROL,
  APPLICATION_AREA_CREATE,
  APPLICATION_AREA_EDIT,
  APPLICATION_AREA_LIST,
  COMMENTOR_ROL,
  LOGIN,
  MATERIAL_CREATE,
  MATERIAL_EDIT,
  MATERIAL_LIST,
  READONLY_ROL,
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
import Unauthorized from "./components/Unauthorized/unautorized";

const privateRoutes = [
  {
    path: MATERIAL_CREATE,
    component: <AddMaterial />,
    allowRoles: [ADMIN_ROL],
  },
  {
    path: MATERIAL_LIST,
    component: <ListMaterial />,
    allowRoles: [ADMIN_ROL],
  },
  {
    path: MATERIAL_EDIT,
    component: <EditMaterial />,
    allowRoles: [ADMIN_ROL],
  },
  {
    path: APPLICATION_AREA_CREATE,
    component: <AddApplicationArea />,
    allowRoles: [ADMIN_ROL],
  },
  {
    path: APPLICATION_AREA_LIST,
    component: <ListApplicationArea />,
    allowRoles: [ADMIN_ROL],
  },
  {
    path: APPLICATION_AREA_EDIT,
    component: <EditApplicationArea />,
    allowRoles: [ADMIN_ROL],
  },
  {
    path: SYSTEM_CREATE,
    component: <AddSystem />,
    allowRoles: [ADMIN_ROL],
  },
  {
    path: SYSTEM_EDIT,
    component: <EditSystem />,
    allowRoles: [ADMIN_ROL],
  },
  {
    path: SYSTEM_LIST,
    component: <ListSystem />,
    allowRoles: [ADMIN_ROL, COMMENTOR_ROL, READONLY_ROL],
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
              element={<PrivateRoute allowRoles={option.allowRoles}>{option.component}</PrivateRoute>}
            />
          ))}
          {/* Route for unauthorized access */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </div>
  );
}
