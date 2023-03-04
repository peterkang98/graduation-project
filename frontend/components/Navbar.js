import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import styles from '../styles/Navbar.module.css'

export default function Navbar(props) {
  const style = {background:"#303133", borderRadius:"9px"};
  const [currentPage, setCurrentPage] = useState("");

  useEffect(()=>{
    setCurrentPage(props.curPage)
  },[])

  return (
    <nav>
      <ul className={styles.navbar}>
        <li>
          <Link href="/browse/video">
            <div className={styles.logo}>
              <a>
                <Image src="/logo.png" width="161" height="38" />
              </a>
            </div>
          </Link>
        </li>
        <li className={styles.nav_list} style={currentPage==="Home"?style:{}}>
          <Link href="/browse/video">
            <a>
              <div className={styles.nav_item}>
                <Image src="/home.png" width="20" height="20" />
                <div>홈</div>
              </div>
            </a>
          </Link>
        </li>
        <li className={styles.nav_list} style={currentPage==="Search"?style:{}}>
          <Link href="/search">
            <a>
              <div className={styles.nav_item}>
                <Image src="/search.png" width="20" height="20" />
                <div>검색</div>
              </div>
            </a>
          </Link>
        </li>
        <li><hr/></li>
        <li className={styles.nav_list} style={currentPage==="Watchings"?style:{}}>
          <Link href="/watchings">
            <a>
              <div className={styles.nav_item}>
                <Image src="/play.png" width="20" height="20" />
                <div>이어보기</div>
              </div>
            </a>
          </Link>
        </li>
        <li className={styles.nav_list} style={currentPage==="Ratings"?style:{}}>
          <Link href="/rated">
            <a>
              <div className={styles.nav_item}>
                <Image src="/star.png" width="20" height="20" />
                <div>평가한 작품</div>
              </div>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}