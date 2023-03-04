import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "../styles/EpisodeInfo.module.css";

export default function EpisodeInfo(props) {
  const [sortMethod, setSortMethod] = useState(0);
  const [episodeArr, setEpisodeArr] = useState(props.episodes["episodes"].slice().reverse());
  const [showDropDown, setShowDropDown] = useState(false);
  const thumbUrl = props.baseURL + props.backdrop;

  useEffect(() => {
    setEpisodeArr(props.episodes["episodes"].slice().reverse());
  },[props.seasonNum]);
  
  return (
    <section className={styles.sec_container}>
      <div className={styles.info_container}>
        <span className={styles.ep_lettering}>{`에피소드 ${props.epNum}`}</span>
        <div className={styles.sort_container}>
          <button className={styles.sort_option} onClick={() => setShowDropDown(!showDropDown)}>
            {sortMethod == 0 ? "최신순 " : "방영순 "}
            <Image src="/down_arrow.svg" width="10" height="10" />
          </button>
          {showDropDown && (
            <div className={styles.drop_down}>
              <ul className={styles.menu}>
                <li>
                  <button
                    className={styles.menu_button}
                    onClick={() => {
                      setSortMethod(1);
                      setEpisodeArr(props.episodes["episodes"]);
                      setShowDropDown(false);
                    }}
                  >
                    방영순
                  </button>
                </li>
                <li>
                  <button
                    className={styles.menu_button}
                    onClick={() => {
                      setSortMethod(0);
                      setEpisodeArr(props.episodes["episodes"].slice().reverse());
                      setShowDropDown(false);
                    }}
                  >
                    최신순
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {episodeArr.map((ep, i) => (
        <Link href={`/watch/${ep["episode_id"]}?snum=${props.seasonNum}`} key={`ep_${i}`}>
          <div className={styles.ep_container}>
            <div className={styles.img_container}>
              <img
                src={
                  ep["video_path"].slice(-4) == ".mpd" ? `${props.baseURL}/thumbnails${ep["video_path"].slice(0, -3)}jpg` : thumbUrl
                }
              />
              <div className={styles.progress_bar}></div>
              <div className={styles.resume_bar} style={{ width: `${(ep["resume_time"]/ep["duration"]*100).toFixed(2)}%`}}></div>
              <div className={styles.play_button}>
                <Image src="/poster_play.svg" width="36" height="36" />
              </div>
            </div>
            <div className={styles.ep_title}>
              <p>{(props.episodes["season"][0]["season_type_name"] == "season" &&
              `시즌 ${props.seasonNum}: ${ep["episode_number"]}화 ${ep["episode_title"]}`)||
              (props.episodes["season"][0]["season_type_name"] == "special" && ep["episode_title"])}</p>
              <span>{`${ep["duration"]}분`}</span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}