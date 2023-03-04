import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "react-query";
import styles from "../../styles/Browse.module.css";
import styles2 from "../../styles/Contents.module.css";
import Navbar from "../../components/Navbar";
import TopNavigation from "../../components/TopNavigation";
import EpisodeInfo from "../../components/EpisodeInfo";
import ContentInfo from "../../components/ContentInfo";
import SimilarContents from "../../components/SimilarContents";
import { FaStar } from "../../node_modules/react-icons/fa";

export default function content(props) {
  const router = useRouter();
  const [contentId, setContentId] = useState(router.query.contentId);
  const [seasonNum, setSeasonNum] = useState(router.query.snum);
  const [curTab, setCurTab] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [ratingVal, setRatingVal] = useState(null);
  const [hoverVal, setHoverVal] = useState(null);
  const [showSeasonDropDown, setShowSeasonDropDown] = useState(false);
  let isAMovie = router.query.snum == undefined || router.query.snum == null;
  let URL =
    (isAMovie && `${props.baseURL}/movies/${contentId}`) || (!isAMovie && `${props.baseURL}/seasons/${contentId}?snum=${seasonNum}`);

  const { data: content_Data, isSuccess: content_Load } = useQuery(
    ["c_data", contentId],
    async () => {
      const { data } = await axios.get(`${props.baseURL}/contents/${contentId}`);
      return data;
    },
    { enabled: router.isReady }
  );
  const { data: spec_Data, isSuccess: spec_Load } = useQuery(
    ["specified_data", seasonNum, contentId],
    async () => {
      const { data } = await axios
        .get(URL, {
          headers: { Authorization: props.userSession["auth_token"] },
        })
        .catch((err) => {
          console.log(err);
        });
      if(data["rating"]!=null){
        setRatingVal(data["rating"]["rating"]);
      }
      return data;
    },
    { enabled: router.isReady && props.userSession["auth_token"] != null }
  );
  const { data: all_season_Data, isSuccess: all_season_Load } = useQuery(
    ["s_data", seasonNum, contentId],
    async () => {
      const { data } = await axios
        .get(`${props.baseURL}/seasons/${contentId}?snum=all`, {
          headers: { Authorization: props.userSession["auth_token"] },
        })
        .catch((err) => {
          console.log(err);
        });
      return data;
    },
    { enabled: !isAMovie && props.userSession["auth_token"] != null }
  );
  const { data: related_Data, isSuccess: related_Load } = useQuery(["similar_contents", contentId], async () => {
    const { data } = await axios.get(`${props.baseURL}/related/${contentId}`);
    return data;
  });

  let isSuccessful = !isAMovie ? content_Load && spec_Load && related_Load && all_season_Load : content_Load && spec_Load;

  function switchTab(e) {
    if (e.currentTarget.id == "tab0") {
      setCurTab(0);
    } else if (e.currentTarget.id == "tab1") {
      setCurTab(1);
    } else if (e.currentTarget.id == "tab2") {
      setCurTab(2);
    }
  }

  function TimeConversion(min) {
    if (min <= 60) {
      return `${min}분`;
    } else {
      if (min % 60 == 0) {
        return `${min / 60}시간`;
      } else {
        const hour = Math.floor(min / 60);
        const minute = min % 60;
        return `${hour}시간 ${minute}분 ·`;
      }
    }
  }

  function RateContent(val){
    axios.post(`${props.baseURL}/ratings`, { content_id: contentId, rating: val}, {
      headers: { Authorization: props.userSession["auth_token"] }
    }).then(()=>alert("평가가 완료되었습니다.")).catch(err => console.log(err))
  }

  useEffect(() => {
    setSeasonNum(router.query.snum);
    setContentId(router.query.contentId);
    setCurTab(0);
    setShowRating(false);
    setHoverVal(null);
  }, [router.asPath]);

  return (
    <div className={styles.main_page}>
      <Navbar curPage={""} />
      <TopNavigation logOut={props.onLogOut} userSession={props.userSession} />
      {!isSuccessful ? (
        <div className={styles.spinner_container}>
          <div className="spinner"></div>
          <h1>로딩 중...</h1>
        </div>
      ) : (
        <main className={styles.page_container}>
          <div>
            <header>
              <section className={styles2.desc_container}>
                <img
                  src={
                    !isAMovie
                      ? `${props.baseURL}/${spec_Data["season"][0]["season_poster_path"]}`
                      : `${props.baseURL}/${content_Data["poster_path"]}`
                  }
                />
                <div className={styles2.desc}>
                  <h1>{isAMovie ? content_Data["korean_title"] : spec_Data["season"][0]["season_full_title"]}</h1>
                  <p className={styles2.tag}>
                    {content_Data["categories"].length != 0 && (
                      <span>
                        {content_Data["categories"].slice(0, 2).map((category) => `${category["category_name"]} · `)}
                        {content_Data["categories"][2]["category_name"]}
                      </span>
                    )}
                    <span className={styles2.bar}></span>
                    <span>{isAMovie ? TimeConversion(spec_Data["duration"]) : `시즌 ${content_Data["number_of_seasons"]}개 ·`}</span>
                    <span className={styles2.avg_rating}>{`평균 ${content_Data["average_rating"]}`}</span>
                    <span className={styles2.bar}></span>
                    <span className={styles2.maturity_rating}>{content_Data["maturity_rating"]}</span>
                  </p>
                  <p className={styles2.overview}>{content_Data["overview"]}</p>
                </div>
              </section>
              <div className={styles2.buttons_container}>
                <section className={styles2.button_wrapper}>
                  <div className={styles2.play_rate_container}>
                    {/*placeholder. just plays the first episode*/}
                    <Link
                      href={isAMovie ? `/watch/${contentId}` : `/watch/${spec_Data["episodes"][0]["episode_id"]}?snum=${seasonNum}`}
                    >
                      <div className={styles2.play_container}>
                        <Image src="/content_play.svg" width="14" height="16" layout="fixed" />
                        <span>감상하기</span>
                      </div>
                    </Link>
                    <button className={styles2.rate_button} onClick={() => setShowRating(!showRating)}>
                      <Image src="/content_star.svg" width="16" height="16" layout="fixed" />
                      <span>평가하기</span>
                    </button>
                  </div>
                  {showRating && (
                    <div className={styles2.stars_container}>
                      {[...Array(10)].map((val, i) => (
                        <label key={`star${i}`}>
                          <input
                            type="radio"
                            name="rating"
                            style={{ display: "none" }}
                            value={(i + 1) * 0.5}
                            onClick={() => {
                              setRatingVal((i + 1) * 0.5);
                              RateContent((i + 1) * 0.5);
                            }}
                          />
                          <div className={styles2.stars} style={{ direction: i % 2 === 0 ? "ltr" : "rtl" }}>
                            <FaStar
                              size={44}
                              color={(i + 1) * 0.5 <= (hoverVal || ratingVal) ? "#ffc107" : "#4d4d4d"}
                              onMouseEnter={() => setHoverVal((i + 1) * 0.5)}
                              onMouseLeave={() => setHoverVal(null)}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  <div className={styles2.but_container}>
                    {!isAMovie && content_Data["number_of_seasons"]>1 &&(
                      <button className={styles2.seasons_button} onClick={() => setShowSeasonDropDown(!showSeasonDropDown)}>
                        <span>
                          {spec_Data["season"][0]["season_full_title"].slice(-4, -2) == "시즌"
                            ? spec_Data["season"][0]["season_full_title"].slice(-4)
                            : (spec_Data["season"][0]["season_type_name"] == "season" &&
                                `시즌 ${spec_Data["season"][0]["season_number"]}`) ||
                              (spec_Data["season"][0]["season_type_name"] == "special" && `스페셜`)}
                        </span>
                        <Image src="/down_arrow.svg" width="12" height="12" layout="fixed" />
                      </button>
                    )}
                    {showSeasonDropDown && (
                      <div className={styles2.drop_down}>
                        <ul className={styles2.menu}>
                          {all_season_Data.map((season, i) => (
                            <li key={`season${i}`}>
                              <button
                                className={styles2.menu_button}
                                onClick={() => {
                                  setSeasonNum(season["season_number"]);
                                  router.push(`/contents/${contentId}?snum=${season["season_number"]}`);
                                  setShowSeasonDropDown(false);
                                }}
                              >
                                {(season["season_full_title"].slice(-4, -2) == "시즌"
                                  ? season["season_full_title"].slice(-4)
                                  : season["season_type_name"] == "season" && `시즌 ${season["season_number"]}`) ||
                                  (season["season_type_name"] == "special" && `스페셜`)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </header>
            <ul className={styles2.info_tabs}>
              <li>
                <button className={curTab == 0 ? styles2.cur_tab : styles2.grey_tab} id="tab0" onClick={(e) => switchTab(e)}>
                  콘텐츠 정보
                </button>
              </li>
              {!isAMovie && (
                <li>
                  <button className={curTab == 1 ? styles2.cur_tab : styles2.grey_tab} id="tab1" onClick={(e) => switchTab(e)}>
                    회차 정보
                  </button>
                </li>
              )}
              <li>
                <button className={curTab == 2 ? styles2.cur_tab : styles2.grey_tab} id="tab2" onClick={(e) => switchTab(e)}>
                  비슷한 콘텐츠
                </button>
              </li>
            </ul>
            {curTab == 0 && content_Data["people"].length > 0 && (
              <ContentInfo people={content_Data["people"]} baseURL={props.baseURL} />
            )}
            {curTab == 1 && seasonNum && (
              <EpisodeInfo
                episodes={props.client.getQueryData(["specified_data", seasonNum, contentId])}
                epNum={props.client.getQueryData(["specified_data", seasonNum, contentId])["season"][0]["number_of_episodes"]}
                seasonNum={seasonNum}
                baseURL={props.baseURL}
                backdrop={content_Data["backdrop_path"]}
              />
            )}
            {curTab == 2 && content_Data["categories"].length > 0 && related_Load && (
              <SimilarContents data={related_Data} baseURL={props.baseURL} title={"비슷한 콘텐츠"} />
            )}
          </div>
        </main>
      )}
    </div>
  );
}
