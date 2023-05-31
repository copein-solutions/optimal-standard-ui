import CustomMenu from "../menu";
import { CustomHeader } from "../header/Header";
import { useState } from "react";

export default function PageWrapper() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  return (
    <>
      <CustomHeader onMenuOpen={handleMenuOpen} />
      <CustomMenu isOpen={isMenuOpen} setOpen={setIsMenuOpen}/>
    </>
  );
}
