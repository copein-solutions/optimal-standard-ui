import CustomMenu from "../menu";
import { CustomHeader } from "../header/Header";
import { useEffect, useState } from "react";

export default function PageWrapper() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
    console.log(isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(isMenuOpen);
    console.log("use effect");
  }, [isMenuOpen]);

  return (
    <>
      <CustomHeader onMenuOpen={handleMenuOpen} />
      <CustomMenu isOpen={isMenuOpen}/>
    </>
  );
}
