import axios from "axios";
import { useQuery } from "react-query";
import styles from "../../styles/Browse.module.css";
import Navbar from "../../components/Navbar";
import TopNavigation from "../../components/TopNavigation";
import HomeCards from "../../components/HomeCards";
import { useState} from 'react'
import Carousel from "../../components/Carousel";
import SimilarContents from "../../components/SimilarContents";

export default function video(props) {
  const [showButton, setShowButton] = useState(0);

  const { data: homeCard_Data, isSuccess: homeCard_Load } = useQuery("home_cards",
    async () => {
      const { data } = await axios.get(`${props.baseURL}/home_cards`);
      return data;
    }
  );
  const { data: playlist1_Data, isSuccess: playlist1_Load } = useQuery("playlist5",
    async () => {
      const { data } = await axios.get(`${props.baseURL}/playlists/5`);
      return data;
    }
  );
  const { data: playlist5_Data, isSuccess: playlist5_Load } = useQuery("playlist1",
    async () => {
      const { data } = await axios.get(`${props.baseURL}/playlists/1`);
      return data;
    }
  );
  const { data: continue_Data, isSuccess: continue_Load } = useQuery("continue_home",
    async () => {
      const { data } = await axios.get(`${props.baseURL}/continue`, {
        headers: { Authorization: props.userSession["auth_token"] }
      });
      return data;
    },{ enabled: props.userSession["auth_token"]!=null }
  );

  const { data: all_movies_Data, isSuccess: all_movies_Load } = useQuery("all_movies",
    async () => {
      const { data } = await axios.get(`${props.baseURL}/contents/movie`);
      return data;
    }
  );

  const { data: all_tvs_Data, isSuccess: all_tvs_Load } = useQuery("all_tvs",
    async () => {
      const { data } = await axios.get(`${props.baseURL}/contents/tv`);
      return data;
    }
  );

  const isSuccessful = homeCard_Load && playlist1_Load && continue_Load && playlist5_Load;

  return (
    <div className={styles.main_page}>
      <Navbar curPage={"Home"} />
      <TopNavigation logOut={props.onLogOut} userSession={props.userSession}/>
      {!isSuccessful ? (
        <div className={styles.spinner_container}>
          <div className="spinner"></div>
          <h1>로딩 중...</h1>
        </div>
      ) : (
        <main className={styles.page_container}>
          <div className={styles.container}>
            <h1>홈</h1>
            <hr />
            <HomeCards baseURL={props.baseURL} cardData={homeCard_Data} />
            <section className={styles.selector_container}>
              <ul className={styles.movie_tv_selector}>
                <li>
                  <button className={showButton==0 ? styles.active_button:styles.inactive_button}
                  onClick={()=>setShowButton(0)}>
                    전체
                  </button>
                </li>
                <li>
                  <button className={showButton==1 ? styles.active_button:styles.inactive_button}
                  onClick={()=>setShowButton(1)}>
                    영화
                  </button>
                </li>
                <li>
                  <button className={showButton==2 ? styles.active_button:styles.inactive_button}
                  onClick={()=>setShowButton(2)}>
                    TV 프로그램
                  </button>
                </li>
              </ul>
            </section>
            {showButton==0&&
            <>
              <Carousel baseURL={props.baseURL} cardData={playlist1_Data}/>
              <Carousel baseURL={props.baseURL} cardData={playlist5_Data}/>
              {JSON.stringify(continue_Data)!="{}" && <Carousel baseURL={props.baseURL} cardData={continue_Data}/>}
            </>}
            
          </div>
          {showButton==1&& all_movies_Load &&
            <>
              <SimilarContents data={all_movies_Data} baseURL={props.baseURL} title={"영화"}/>
            </>}
            {showButton==2&& all_tvs_Load &&
            <>
              <SimilarContents data={all_tvs_Data} baseURL={props.baseURL} title={"TV 프로그램"}/>
            </>}
        </main>
      )}
    </div>
  );
}
