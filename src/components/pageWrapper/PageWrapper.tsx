import CustomMenu from "../menu";
import { CustomHeader } from "../header/Header";
import { useState } from "react";
import { menuOptions } from "../menu/Menu";
import { Route, Routes } from "react-router-dom";
import EditMaterial from "../../pages/editMaterial";
import ListMaterial from "../../pages/listMaterial";
import AddMaterial from "../../pages/addMaterial";
import AddApplicationArea from "../../pages/addApplicationArea";
import ListApplicationArea from "../../pages/listApplicationArea";
import EditApplicationArea from "../../pages/editApplicationArea";

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
        <Route path="/material" element={<AddMaterial />} />
        <Route path="/materials" element={<ListMaterial />} />
        <Route path="/material/:id/edit" element={<EditMaterial />} />
        <Route path="/application_area" element={<AddApplicationArea />} />
        <Route path="/application_areas" element={<ListApplicationArea />} />
        <Route path="/application_area/:id/edit" element={<EditApplicationArea />} />
        {menuOptions.map((option, index) => (
          <Route key={index} path={option.path} Component={option.component} />
        ))}
      </Routes>
    </>
  );
}
