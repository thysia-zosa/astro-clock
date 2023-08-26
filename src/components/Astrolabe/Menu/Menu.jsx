import { useState } from "react";
import styles from "./Menu.module.css";
import MenuItemList from "./MenuItemList";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((currentState) => !currentState);
  };

  const buttonContent = isOpen ? "X" : "☰";

  return (
    <nav>
      <div className={styles.hamburger} onClick={toggleMenu}>
        {buttonContent}
      </div>
      {isOpen && <MenuItemList toggleMenu={toggleMenu} />}
    </nav>
  );
};

export default Menu;
