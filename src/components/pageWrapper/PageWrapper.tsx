import CustomMenu from "../menu";
import { CustomHeader } from "../header/Header";
import { useState } from "react";
import { menuOptions } from "../menu/Menu";
import { Route, Routes } from "react-router-dom";
import EditMaterial from "../../pages/editMaterial";
import MaterialTable from "../materialTable";
import AddMaterial from "../../pages/addMaterial";

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
        <Route path="/material/:id/edit" element={<EditMaterial />} />
        <Route path="/materials" element={<MaterialTable />} />
        <Route path="/material" element={<AddMaterial />} />
        {menuOptions.map((option, index) => (
          <Route key={index} path={option.path} Component={option.component} />
        ))}
      </Routes>
    </>
  );
}
