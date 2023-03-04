import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Sign_up(props) {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    birthday: "",
    membership_time_left: 0,
  });
  const [wrongSignUpReason, setWrongSignUpReason] = useState("");
  const [showWrongSignUp, setShowWrongSignUp] = useState(false);

  function handle(e) {
    let newData = { ...userData };
    newData[e.target.name] = e.target.value;
    setUserData(newData);
  }

  function submit(e) {
    e.preventDefault();
    if (userData.username.length < 2) {
      setShowWrongSignUp(true);
      setWrongSignUpReason("닉네임을 2자 이상으로 입력해주세요");
      return;
    } else if (userData.password.length < 6) {
      setShowWrongSignUp(true);
      setWrongSignUpReason("비밀번호를 6자 이상으로 입력해주세요");
      return;
    } else if (userData.password != userData.password_confirmation) {
      setShowWrongSignUp(true);
      setWrongSignUpReason("비밀번호가 일치하지 않습니다");
      return;
    }
    axios
      .post(`${props.baseURL}/users`, { user: userData })
      .then((res) => {
        if (res.headers.authorization !== null) {
          props.onLogIn(res);
        }
      })
      .catch((err) => {
        console.log(err);
        setShowWrongSignUp(true);
        setWrongSignUpReason("이미 가입된 계정입니다. 이메일 주소를 다시 입력해주세요");
      });
  }

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
        <div className={styles.login_form_wrapper}>
          <div className={styles.login_password}>
            <div className={styles.medium_text}>회원가입</div>
          </div>
          <form className={styles.login_form} onSubmit={(e) => submit(e)}>
            <input
              name="username"
              onChange={(e) => handle(e)}
              className={styles.top_input}
              autoComplete="off"
              placeholder="닉네임 (2자 이상)"
              type="text"
              value={userData.username}
            />
            <input
              name="birthday"
              onChange={(e) => handle(e)}
              className={styles.middle_input}
              autoComplete="off"
              type="date"
              value={userData.birthday}
            />
            <input
              name="email"
              onChange={(e) => handle(e)}
              className={styles.middle_input}
              autoComplete="off"
              placeholder="이메일 (example@gmail.com)"
              type="email"
              value={userData.email}
            />
            <input
              name="password"
              onChange={(e) => handle(e)}
              className={styles.middle_input}
              autoComplete="off"
              placeholder="비밀번호 (6자 이상)"
              type="password"
              value={userData.password}
            />
            <input
              name="password_confirmation"
              onChange={(e) => handle(e)}
              className={styles.pw_input}
              autoComplete="off"
              placeholder="비밀번호 확인"
              type="password"
              value={userData.password_confirmation}
            />
            {showWrongSignUp && <span className={styles.wrong_login}>{wrongSignUpReason}</span>}
            <button type="submit" className={styles.form_submit}>
              계정 생성하기
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
