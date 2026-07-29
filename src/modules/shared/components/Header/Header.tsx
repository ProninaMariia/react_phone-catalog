import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import styles from './Header.module.scss';

const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
  return isActive
    ? `${styles.navLink} ${styles.navLinkActive}`
    : styles.navLink;
};

export const Header = () => {
  const { totalQuantity } = useCart();
  const { favorites } = useFavorites();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <NavLink to="/" className={styles.logo}>
          <span className={styles.logoText}>Nice Gadgets</span>
        </NavLink>

        <nav className={styles.nav}>
          <NavLink to="/phones" className={getNavLinkClass}>
            Phones
          </NavLink>
          <NavLink to="/tablets" className={getNavLinkClass}>
            Tablets
          </NavLink>
          <NavLink to="/accessories" className={getNavLinkClass}>
            Accessories
          </NavLink>
        </nav>
      </div>

      <div className={styles.icons}>
        <NavLink
          to="/favorites"
          className={`${getNavLinkClass({ isActive: false })} ${styles.iconLink}`}
          aria-label="Favorites"
        >
          <span className={styles.iconHeart}>
            {favorites.length > 0 ? '♥' : '♡'}
          </span>
          {favorites.length > 0 && (
            <span className={styles.badge}>{favorites.length}</span>
          )}
        </NavLink>
        <NavLink
          to="/cart"
          className={`${getNavLinkClass({ isActive: false })} ${styles.iconLink}`}
          aria-label="Cart"
        >
          <span className={styles.iconCart}>🛒</span>
          {totalQuantity > 0 && (
            <span className={styles.badge}>{totalQuantity}</span>
          )}
        </NavLink>
      </div>
    </header>
  );
};
