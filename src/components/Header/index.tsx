import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <nav>
        <img src="/images/logo.svg" alt="" />
      </nav>
    </header>
  );
}
