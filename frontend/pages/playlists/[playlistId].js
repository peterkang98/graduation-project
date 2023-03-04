import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "react-query";
import styles from "../../styles/Browse.module.css";
import styles2 from "../../styles/Playlists.module.css";
import Navbar from "../../components/Navbar";
import TopNavigation from "../../components/TopNavigation";
import Carousel from "../../components/Carousel";

export default function content(props) {
  const router = useRouter();
  const [playlistId, setPlaylistId] = useState(router.query.playlistId);
  const contentsLen = useRef();
  const carouselTags = useRef([]);
  const [showTags, setShowTags] = useState(false);

  const { data: playlist_Data, isSuccess: playlist_Load } = useQuery(
    ["p_data", playlistId],
    async () => {
      const { data } = await axios.get(`${props.baseURL}/home_cards/${playlistId}`);
      return data;
    },
    { enabled: router.isReady }
  );

  useEffect(() => {
    setShowTags(false);
    setPlaylistId(router.query.playlistId);
    if (playlist_Data==undefined) return;
    contentsLen.current = Math.ceil(playlist_Data["contents"].length / 6);
    for (let i = 0; i < contentsLen.current; i++) {
      let json_data = { playlist: { playlist_title: "" } };
      let remainder = (playlist_Data["contents"].length - 6 * i) % 6;
      if (contentsLen.current > i + 1) {
        json_data["contents"] = playlist_Data["contents"].slice(i * 6, 6 * (i + 1));
      } else {
        if (remainder == 0) {
          json_data["contents"] = playlist_Data["contents"].slice(i * 6, 6 * (i + 1));
        } else {
          json_data["contents"] = playlist_Data["contents"].slice(i * 6, i * 6 + remainder);
        }
      }
      carouselTags.current.push(<Carousel key={`playlist_row${i}`} baseURL={props.baseURL} cardData={json_data} />);
    }
    setShowTags(true);
  }, [router.asPath, playlist_Load]);

  return (
    <div className={styles.main_page}>
      <Navbar curPage={""} />
      <TopNavigation logOut={props.onLogOut} userSession={props.userSession}/>
      {!showTags ? (
        <div className={styles.spinner_container}>
          <div className="spinner"></div>
          <h1>로딩 중...</h1>
        </div>
      ) : (
        <main className={styles.page_container}>
          <div>
            <header>
              <section className={styles2.desc_container}>
                <div className={styles2.desc}>
                  <h1>{playlist_Data["homecard"]["card_title"]}</h1>
                  <p className={styles2.overview}>{playlist_Data["playlist"]["playlist_description"]}</p>
                </div>
              </section>
              <div className={styles2.contents_container}>{carouselTags.current.map((carousel) => carousel)}</div>
            </header>
          </div>
        </main>
      )}
    </div>
  );
}
