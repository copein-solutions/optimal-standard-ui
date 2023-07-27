import CustomMenu from "../menu";
import { CustomHeader } from "../header/Header";
import { useState } from "react";
import { menuOptions } from "../menu/Menu";
import { Route, Routes } from "react-router-dom";
import EditMaterial from "../../pages/material/editMaterial";
import ListMaterial from "../../pages/material/listMaterial";
import AddMaterial from "../../pages/material/addMaterial";
import AddApplicationArea from "../../pages/applicationArea/addApplicationArea";
import ListApplicationArea from "../../pages/applicationArea/listApplicationArea";
import EditApplicationArea from "../../pages/applicationArea/editApplicationArea";
import PrivateRoute from "../PrivateRoute";
import {
  APPLICATION_AREA_CREATE,
  APPLICATION_AREA_EDIT,
  APPLICATION_AREA_LIST,
  MATERIAL_CREATE,
  MATERIAL_EDIT,
  MATERIAL_LIST,
  SYSTEM_CREATE,
  SYSTEM_EDIT,
  SYSTEM_LIST,
} from "../../utils/constants";
import AddSystem from "../../pages/system/addSystem";
import ListSystem from "../../pages/system/listSystem";
import EditSystem from "../../pages/system/editSystem";

export default function PageWrapper() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  return (
    <>
      <CustomHeader onMenuOpen={handleMenuOpen} />
      <CustomMenu isOpen={isMenuOpen} setOpen={setIsMenuOpen} />

      <Routes>
        <Route
          path={MATERIAL_CREATE}
          element={
            <PrivateRoute>
              <AddMaterial />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path={MATERIAL_LIST}
          element={
            <PrivateRoute>
              <ListMaterial />
            </PrivateRoute>
          }
        />
        <Route
          path={MATERIAL_EDIT}
          element={
            <PrivateRoute>
              <EditMaterial />
            </PrivateRoute>
          }
        />
        <Route
          path={APPLICATION_AREA_CREATE}
          element={
            <PrivateRoute>
              <AddApplicationArea />
            </PrivateRoute>
          }
        />
        <Route
          path={APPLICATION_AREA_LIST}
          element={
            <PrivateRoute>
              <ListApplicationArea />
            </PrivateRoute>
          }
        />
        <Route
          path={APPLICATION_AREA_EDIT}
          element={
            <PrivateRoute>
              <EditApplicationArea />
            </PrivateRoute>
          }
        />
        <Route
          path={SYSTEM_CREATE}
          element={
            <PrivateRoute>
              <AddSystem />
            </PrivateRoute>
          }
        />
        <Route
          path={SYSTEM_LIST}
          element={
            <PrivateRoute>
              <ListSystem />
            </PrivateRoute>
          }
        />
        <Route
          path={SYSTEM_EDIT}
          element={
            <PrivateRoute>
              <EditSystem />
            </PrivateRoute>
          }
        />
        {menuOptions.map((option, index) => (
          <Route key={index} path={option.path} Component={option.component} />
        ))}
      </Routes>
    </>
  );
}
