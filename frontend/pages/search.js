import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import TopNavigation from "../components/TopNavigation";
import { useQuery } from "react-query";
import styles from "../styles/Search.module.css";

export default function search(props) {
  const [searchWord, setSearchWord] = useState("");
  const { data: search_Data, isSuccess: search_Load } = useQuery(
    ["search", searchWord],
    async () => {
      const { data } = await axios.get(`${props.baseURL}/search/${searchWord}`);
      return data;
    },
    { enabled: searchWord != "" }
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

  function submit(e) {
    e.preventDefault();
    setSearchWord(e.target[0].value.replace(/\s+/g, "").toLowerCase());
  }

  return (
    <div className={styles.main_page}>
      <Navbar curPage={"Search"} />
      <TopNavigation search={true} logOut={props.onLogOut} submit={(e) => submit(e)} userSession={props.userSession}/>
      {searchWord != "" && !search_Load ? (
        <div className={styles.spinner_container}>
          <div className="spinner"></div>
          <h1>로딩 중...</h1>
        </div>
      ) : (
        <main className={styles.page_container}>
          <section className={styles.container}>
            {search_Data != undefined && (search_Data["result"].length > 0 ? (
              search_Data["result"].map((content, i) => (
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
                        <div className={styles.age_container}>
                          <Image
                            src={
                              (content["maturity_rating"] == "15" && "/fifteen.svg") ||
                              (content["maturity_rating"] == "12" && "/twelve.svg") ||
                              (content["maturity_rating"] == "ALL" && "/all.svg") ||
                              (content["maturity_rating"] == "18" && "/eightteen.svg")
                            }
                            width="50"
                            height="50"
                          />
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))
            ) : (
              <div className={styles.content_container}>
                <div className={styles.content_info_container}>
                  <h1 className={styles.title}>죄송합니다! 검색하신 제목으로는 콘텐츠를 찾지 못했습니다.</h1>
                </div>
              </div>
            ))}
          </section>
        </main>
      )}
    </div>
  );
}
