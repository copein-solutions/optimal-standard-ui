import CustomMenu from "../menu";
import { CustomHeader } from "../header/Header";
import { useState } from "react";
import { menuOptions } from "../menu/Menu";
import { Route, Routes } from "react-router-dom";
import EditMaterial from "../../pages/editMaterial";
import ListMaterial from "../../pages/listMaterial";
import AddMaterial from "../../pages/addMaterial";
import AddApplicationArea from "../../pages/applicationArea/addApplicationArea";
import ListApplicationArea from "../../pages/applicationArea/listApplicationArea";
import EditApplicationArea from "../../pages/applicationArea/editApplicationArea";
import PrivateRoute from "../PrivateRoute";

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
          path="/material/create"
          element={
            <PrivateRoute>
              <AddMaterial />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/material/list"
          element={
            <PrivateRoute>
              <ListMaterial />
            </PrivateRoute>
          }
        />
        <Route
          path="/material/:id/update"
          element={
            <PrivateRoute>
              <EditMaterial />
            </PrivateRoute>
          }
        />
        <Route
          path="/application_area/create"
          element={
            <PrivateRoute>
              <AddApplicationArea />
            </PrivateRoute>
          }
        />
        <Route
          path="/application_areas"
          element={
            <PrivateRoute>
              <ListApplicationArea />
            </PrivateRoute>
          }
        />
        <Route
          path="/application_area/:id/update"
          element={
            <PrivateRoute>
              <EditApplicationArea />
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
