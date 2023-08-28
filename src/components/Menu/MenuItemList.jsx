import styles from './MenuItemList.module.css';

const MenuItemList = () => {
  const toggleSettings = () => {};

  return (
    <ul className={styles.menuItemList}>
      <li onClick={toggleSettings}>Settings</li>
    </ul>
  );
};

export default MenuItemList;
