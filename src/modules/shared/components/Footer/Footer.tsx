import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footer}>
        <Link to="/" className={styles.logo} onClick={goToHome}>
          Nice Gadgets
        </Link>

        <div className={styles.links}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Github
          </a>
          <a href="mailto:info@nicegadgets.com" className={styles.link}>
            Contacts
          </a>
          <a href="/" className={styles.link}>
            Rights
          </a>
        </div>

        <button
          type="button"
          className={styles.backToTop}
          onClick={scrollToTop}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
};
