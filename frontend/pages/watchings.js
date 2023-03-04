import axios from "axios";
import Navbar from "../components/Navbar";
import TopNavigation from "../components/TopNavigation";
import { useQuery } from "react-query";
import styles from "../styles/Watchings.module.css";
import Carousel from "../components/Carousel";

export default function watchings(props) {
  const { data, isSuccess } = useQuery(
    ["watchings"],
    async () => {
      const { data } = await axios.get(`${props.baseURL}/continue`, {
        headers: { Authorization: props.userSession["auth_token"] },
      });
      return data;
    },
    { enabled: props.userSession["auth_token"] != null }
  );

  return (
    <div className={styles.main_page}>
      <Navbar curPage={"Watchings"} />
      <TopNavigation logOut={props.onLogOut} userSession={props.userSession} />
      {props.userSession["auth_token"] == null || !isSuccess ? (
        <div className={styles.spinner_container}>
          <div className="spinner"></div>
          <h1>로딩 중...</h1>
        </div>
      ) : (
        <main className={styles.page_container}>
          <section className={styles.container}>
            {data["contents"].length > 0 ? (
              <>
                <h1 className={styles.title}>{props.userSession.user.username + "님의 시청기록"}</h1>
                <Carousel baseURL={props.baseURL} cardData={data} />
              </>
            ) : (
              <div className={styles.content_container}>
                <div className={styles.content_info_container}>
                  <h1>{props.userSession.user.username + "님은 이어보기 기록이 없습니다."}</h1>
                </div>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
