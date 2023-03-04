import Link from "next/link";
import axios from "axios";
import Navbar from "../components/Navbar";
import TopNavigation from "../components/TopNavigation";
import { useQuery } from "react-query";
import styles from "../styles/Search.module.css";
import { FaStar } from "../node_modules/react-icons/fa";

export default function rated(props) {
  const { data, isSuccess } = useQuery(
    ["rated"],
    async () => {
      const { data } = await axios.get(`${props.baseURL}/ratings`, {
        headers: { Authorization: props.userSession["auth_token"] },
      });
      return data;
    },
    { enabled: props.userSession["auth_token"] != null }
  );

  function TimeConversion(min) {
    if (min <= 60) {
      return `${min}분`;
    } else {
      if (min % 60 == 0) {
        return `${min / 60}시간`;
      } else {
        const hour = Math.floor(min / 60);
        const minute = min % 60;
        return `${hour}시간 ${minute}분`;
      }
    }
  }

  return (
    <div className={styles.main_page}>
      <Navbar curPage={"Ratings"} />
      <TopNavigation logOut={props.onLogOut} userSession={props.userSession} />
      {props.userSession["auth_token"] == null || !isSuccess ? (
        <div className={styles.spinner_container}>
          <div className="spinner"></div>
          <h1>로딩 중...</h1>
        </div>
      ) : (
        <main className={styles.page_container}>
          {data["rated"].length > 0 && <h1 className={styles.title}>{props.userSession.user.username + "님이 평가하신 작품"}</h1>}
          <section className={styles.container}>
            {data["rated"].length > 0 ? (
              data["rated"].map((content, i) => (
                <Link
                  key={`result${i}`}
                  href={content["is_a_movie"] ? `/contents/${content["content_id"]}` : `/contents/${content["content_id"]}?snum=1`}
                >
                  <a>
                    <div className={styles.content_container}>
                      <div className={styles.poster_container}>
                        <img src={props.baseURL + content["poster_path"]} />
                      </div>
                      <div className={styles.content_info_container}>
                        <h1>{content["korean_title"]}</h1>
                        <span>
                          {content["is_a_movie"]
                            ? TimeConversion(content["duration_or_episodes"])
                            : `에피소드 ${content["duration_or_episodes"]}개 · 시즌 ${content["number_of_seasons"]}개`}
                        </span>
                        <h3>{"출시일: " + content["release_date"]}</h3>
                        <div className={styles.star_container}>
                            <h2>내가 준 평점:</h2>
                          {[...Array(10)].map((val, i) => (
                            <div key={`stars${i}`} className={styles.stars} style={{ direction: i % 2 === 0 ? "ltr" : "rtl" }}>
                              <FaStar
                                size={44}
                                color={(i + 1) * 0.5 <= (content["rating"]) ? "#ffc107" : "#4d4d4d"}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))
            ) : (
              <div className={styles.content_container}>
                <div className={styles.content_info_container}>
                  <h1>{props.userSession.user.username + "님은 평가하신 작품이 없습니다."}</h1>
                </div>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
