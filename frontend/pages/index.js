import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home(props) {

  return (
    <div className={styles.container}>
      <div className={styles.bg_image}></div>
      <Image src="/signup_background.jpg" layout="fill" objectFit="cover" />
      <nav className={styles.nav}>
        <Image src="/logo.png" width="242" height="57" />
        <div className={styles.login}>
          <Link href="/sign_in">
            <a className={styles.sign_in}>로그인</a>
          </Link>
        </div>
      </nav>
      <main className={styles.main}>
        <span className={styles.big_text}>영화, 드라마, 예능, 다큐멘터리를 무제한으로</span>
        <span className={styles.small_text}>시간제 멤버십으로, 실제 콘텐츠를 시청한 시간만 차감됩니다.</span>
        <Link href="/sign_up">
          <a className={styles.sign_up}>
            <div className={styles.signup_container}>회원가입</div>
          </a>
        </Link>
      </main>
    </div>
  );
}
