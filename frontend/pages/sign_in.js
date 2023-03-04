import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import styles from '../styles/Home.module.css'

export default function Sign_in(props) {
  
  const [userData, setUserData] = useState({
    email:"",
    password:""
  })
  const [showWrongLogin, setShowWrongLogin] = useState(false)

  function handle(e){
    let newData = {...userData}
    newData[e.target.name] = e.target.value
    setUserData(newData)
  }

  function submit(e){
    e.preventDefault();
    axios.post(`${props.baseURL}/users/sign_in`, {user: userData})
    .then(res => {
      if (res.headers.authorization !== null){
        props.onLogIn(res)
      }
    }).catch(err => {
      console.log(err)
      setShowWrongLogin(true)
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg_image}></div>
      <Image src="/signup_background.jpg" layout='fill' objectFit='cover'/>

      <nav className={styles.nav}>
        <Image src="/logo.png" width="242" height="57"/>
        <div className={styles.login}>
          <Link href="/sign_up"><a className={styles.sign_in}>회원가입</a></Link>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.login_form_wrapper}>
          <div className={styles.login_password}>
            <div className={styles.medium_text}>로그인</div>
          </div>
          <form className={styles.login_form} onSubmit={(e)=>submit(e)}>
              <input name="email" onChange={(e)=>handle(e)} className={styles.top_input} autoComplete="off" 
                placeholder="이메일 (example@gmail.com)" type="email" value={userData.email}/>
              <input name="password" onChange={(e)=>handle(e)} className={styles.pw_input} autoComplete="off" 
                placeholder="비밀번호" type="password" value={userData.password}/>
              {showWrongLogin && <span className={styles.wrong_login}>이메일 주소 혹은 비밀번호를 다시 확인해주세요</span>}
              <button type="submit" className={styles.form_submit}>로그인</button>
          </form>
        </div>  
      </main>
    </div>
  )
}
