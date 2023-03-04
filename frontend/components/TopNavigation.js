import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '../styles/TopNavigation.module.css'

export default function TopNavigation(props) {
  const [showDropDown, setShowDropDown] = useState(false)

  function convertTime(time) {
    let years = 0;
    let days = 0;
    let hours = 0;
    let minutes = 0;
    if(time>525600){
      years = Math.floor(time/525600)
      time -= years*525600;
    }
    if(time>1440){
      days = Math.floor(time/1440)
      time -= days*1440;
    }
    hours = Math.floor(time / 60).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    time -= Math.floor(time / 60)*60;
    minutes = Math.floor(time).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    return years==0 ? 
    days==0 ? `${hours}시간 : ${minutes}분`:`${days}일 : ${hours}시간 : ${minutes}분`: 
    `${years}년 : ${days}일 : ${hours}시간 : ${minutes}분`;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav_top}>
        <div>
          {props.search!== undefined && <form className={styles.form_search} onSubmit={(e)=>props.submit(e)}>
            <input type="text" placeholder="콘텐츠 제목을 입력해주세요" className={styles.search_bar}/>
            <button type="submit" className={styles.search_button}>
              <Image src="/search.png" width="20" height="20" />
            </button>
          </form>}
        </div>
        <div className={styles.profile}>
          <button className={styles.profile_button} onClick={()=> setShowDropDown(!showDropDown)}>
            <Image src="/avatar.svg" width="34" height="34"/>
          </button>
          {showDropDown && 
            <div className={styles.drop_down}>
              <ul className={styles.menu}>                
                <li>
                  <div>
                    <div className={styles.text}>{"닉네임: "+props.userSession.user.username}</div>
                  </div>
                </li>
                <li>
                  <div>
                    <div className={styles.text}>{"남은 시간 => "+convertTime(props.userSession.user.membership_time_left)}</div>
                  </div>
                </li>
                <li>
                  <div className={styles.menu_button}>
                    <Link href="/coupon">
                      <a className={styles.text}>쿠폰</a>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className={styles.menu_button}>
                    <button className={styles.text} onClick={()=>props.logOut()}>로그아웃</button>
                  </div>
                </li>
              </ul>
            </div>
          }
        </div> 
      </nav>
    </div>
    );
}