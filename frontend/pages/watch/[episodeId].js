import { useState, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import shaka from "shaka-player/dist/shaka-player.compiled";
import styles from "../../styles/Watch.module.css";

export default function Watch(props) {
  const playerVar = useRef();
  const router = useRouter();
  const [seasonNum, setSeasonNum] = useState(router.query.snum);
  const [querySeasonNum, setQuerySeasonNum] = useState(seasonNum);
  const [epId, setEpId] = useState(router.query.episodeId);
  const [isAMovie, setIsAMovie] = useState(seasonNum == "undefined" || seasonNum == null);
  let URL = (isAMovie && `${props.baseURL}/movies/${epId}`) || (!isAMovie && `${props.baseURL}/episodes/${epId}`);
  const controllerRef = useRef();
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const [showSpeed, setShowSpeed] = useState("none");
  const [showKey, setShowKey] = useState("none");
  const totalDuration = useRef();
  const [nextEp, setNextEp] = useState();
  const thumbSheetUrl = useRef();
  const thumbSheetInfo = useRef();
  const [curThumbSheet, setCurThumbSheet] = useState("01");
  const [hasSubtitle, setHasSubtitle] = useState(false);
  const [nextSeason, setNextSeason] = useState();
  const [tabShown, setTabShown] = useState(false);
  const [dropDownShown, setDropDownShown] = useState(false);
  const [nextButtonShown, setNextButtonShown] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [playImg, setPlayImg] = useState(false);
  const [muteImg, setMuteImg] = useState(false);
  const [currentProg, setCurrentProg] = useState(0);
  const [bufferedProg, setBufferedProg] = useState(0);
  const [subLang, setSubLang] = useState("none");
  const [subtitle, setSubtitle] = useState("");
  const [subTags, setSubTags] = useState();
  const subOptions={"eng": "영어", "kor": "한국어", "jpn": "일본어"};
  const subEndTime = useRef(0);
  const [animation, setAnimation] = useState(false);
  const [animPic, setAnimPic] = useState("");
  const [isShown, setIsShown] = useState(true);
  const uiTimer = useRef("none");
  const uiHovered = useRef(false);
  const [showTimeStamp, setShowTimeStamp] = useState(false);
  const timeStamps = useRef([]);
  const [tsType, setTsType] = useState("");
  const [tsIndex, setTsIndex] = useState(0);
  const newResumeTime = useRef(0);
  const watchedTime = useRef(0);
  const intervalId = useRef(0);

  const { data: episode_Data, isSuccess: episode_Data_Load } = useQuery(
    ["episode", epId],
    async () => {
      const { data } = await axios.get(URL, {
        headers: { Authorization: props.userSession["auth_token"] }
      });
      return data;
    },
    { enabled: router.isReady }
  );

  const { data: cur_season_Data, isSuccess: cur_season_Load } = useQuery(
    ["cur_season_data", seasonNum],
    async () => {
      const { data } = await axios.get(
        `${props.baseURL}/seasons/${episode_Data["content"]["content_id"]}?snum=${seasonNum}`, {
          headers: { Authorization: props.userSession["auth_token"] }
        });
      return data;
    },
    { enabled: !isAMovie && router.isReady && !!episode_Data }
  );

  const { data: query_season_Data, isSuccess: query_season_Load } = useQuery(
    ["query_season_data", querySeasonNum],
    async () => {
      const { data } = await axios.get(
        `${props.baseURL}/seasons/${episode_Data["content"]["content_id"]}?snum=${querySeasonNum}`, {
          headers: { Authorization: props.userSession["auth_token"] }
        });
      return data;
    },
    { enabled: !isAMovie && router.isReady && !!episode_Data }
  );

  const { data: next_season_Data, isSuccess: next_season_Load } = useQuery(
    "next_season_data",
    async () => {
      const { data } = await axios.get(
        `${props.baseURL}/seasons/${episode_Data["content"]["content_id"]}?snum=${parseInt(seasonNum) + 1}`, {
          headers: { Authorization: props.userSession["auth_token"] }
        }
      );
      return data;
    },
    { enabled: !isAMovie && router.isReady && !!episode_Data }
  );

  const { data: all_season_Data, isSuccess: all_season_Load } = useQuery(
    "all_season_data",
    async () => {
      const { data } = await axios.get(
        `${props.baseURL}/seasons/${episode_Data["content"]["content_id"]}?snum=all`, {
          headers: { Authorization: props.userSession["auth_token"] }
        });
      return data;
    },
    { enabled: !isAMovie && router.isReady && !!episode_Data }
  );

  let loadData = isAMovie ? episode_Data_Load : (episode_Data_Load && next_season_Load && cur_season_Load);

  useLayoutEffect(() => {
    if(props.userSession.user.membership_time_left<=0){
      alert("멤버십 구매를 부탁드립니다.")
      router.push("/browse/video");
    }
    if(!isAMovie){
      if (!episode_Data_Load || !cur_season_Load || !next_season_Load) return;
    }else{
      if(!episode_Data_Load) return;
    }

    if(episode_Data["content"]["maturity_rating"]!="ALL"){
      if(parseInt(episode_Data["content"]["maturity_rating"])>getAge(props.userSession.user.birthday)){
        console.log(getAge(props.userSession.user.birthday))
        alert("죄송합니다. 해당 콘텐츠는 "+episode_Data["content"]["maturity_rating"]+"세 이상만 시청 가능합니다.")
        router.push("/browse/video");
      }
    }
    
    playerVar.current = new shaka.Player(controllerRef.current);
    playerVar.current.getNetworkingEngine().registerRequestFilter(function (type, request) {
      request.headers["Authorization"] = props.userSession["auth_token"];
    });

    async function loadAsset() {
      let url;
      if(!isAMovie){
        url = episode_Data["episode"]["video_path"]
      }else{
        url = episode_Data["video_path"]
      }
      await playerVar.current.load(props.baseURL + url);
    }
    loadAsset().then(() => {
      playerVar.current.configure({
        streaming: {
          bufferingGoal: 120,
          bufferBehind: 60,
          alwaysStreamText: true,
          retryParameters: {
            connectionTimeout: 100000,
          },
          lowLatencyMode: true,
          inaccurateManifestTolerance: 0,
          rebufferingGoal: 0.02,
        },
        textDisplayFactory: () => {
          return {
             setTextVisibility: () => {},
             isTextVisible: () => true,
             destroy: () => { }
          }
       }
      });
      totalDuration.current = playerVar.current.seekRange().end;
      const sheetNum = Math.ceil(totalDuration.current / 10 / 60);
      thumbSheetInfo.current = [];
      for (let i = 1, j = 0; i <= sheetNum; i++, j += 600) {
        let formatNum = i.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false
        });
        let elem = {}
        elem[formatNum]=j
        thumbSheetInfo.current.push(elem);
      }
      for(let i = 0; i<episode_Data["subtitles"].length; i++){
        playerVar.current.getMediaElement().textTracks[i].oncuechange = (e) => subtitleCopy(e);
        if(episode_Data["subtitles"][i]["language"] == subLang){
          playerVar.current.getMediaElement().textTracks[i].mode = "showing";
        }
      }
      if(episode_Data["timestamps"].length != 0){
        timeStamps.current = JSON.parse(JSON.stringify(episode_Data["timestamps"]));
        timeStamps.current = timeStamps.current.map((timestamp)=>{
          timestamp["start_time"] = parseFloat(timestamp["start_time"])*60;
          if(timestamp["end_time"] != null){
            timestamp["end_time"] = parseFloat(timestamp["end_time"])*60;
          }else{timestamp["end_time"] = totalDuration.current+1}
          return timestamp
        });
      }
    });

    thumbSheetUrl.current = !isAMovie ? `${props.baseURL}/thumbnail_sheet${episode_Data["episode"]["video_path"].slice(7, -4)}`:
    `${props.baseURL}/thumbnail_sheet${episode_Data["video_path"].slice(7, -4)}`;

    if (episode_Data["subtitles"].length == 0) {
      setHasSubtitle(false);
    } else {
      setHasSubtitle(true);
      setSubTags(episode_Data["subtitles"].map((subtitle, i) => <track key={`sub_lang_${i}`} label={subtitle["language"]} kind="subtitles" src={props.baseURL+subtitle["subtitle_path"]} id={`sub${i}`}/>))
    }

    if(!isAMovie){
      const current_ep_num = parseInt(episode_Data["episode"]["episode_number"]);
      const last_ep_num = parseInt(episode_Data["season"]["number_of_episodes"]);
      const current_season_num = parseInt(seasonNum);
      const last_season_num = parseInt(episode_Data["content"]["number_of_seasons"]);
      if (current_ep_num < last_ep_num || current_season_num < last_season_num) {
        setNextButtonShown(true);
        if (current_ep_num < last_ep_num) {
          setNextEp(cur_season_Data["episodes"][episode_Data["episode"]["episode_number"]]);
          setNextSeason(seasonNum);
        } else {
          setNextEp(next_season_Data["episodes"][0]);
          setNextSeason(next_season_Data["season"][0]["season_type_name"] == "season" && (parseInt(seasonNum)+1));
        }
    }}  

    document.addEventListener("keydown", keyCheck);

    return function cleanup() {
      let continueURL = "";
      newResumeTime.current = Math.round(newResumeTime.current)
      if(newResumeTime.current > 0){
        if(isAMovie){
        continueURL = `${props.baseURL}/continue/${newResumeTime.current}?movie_id=${epId}`;
      }else{
        continueURL = `${props.baseURL}/continue/${newResumeTime.current}?ep_id=${epId}`;
      }
      axios.post(continueURL, {}, {headers: { Authorization: props.userSession["auth_token"] }})
      .then(() => newResumeTime.current = 0).catch(err => console.log(err))}

      props.memTimeMinus(watchedTime.current);
      setShowSpeed("none");
      setShowKey("none");
      setNextButtonShown(false);
      setBuffering(false);
      setTabShown(false);
      setVideoLoaded(false);
      setMuteImg(false);
      setHasSubtitle(false);
      setSubtitle("");
      setSubTags("");
      setCurrentProg(0);
      setBufferedProg(0);
      setAnimPic("");
      setAnimation(false);
      totalDuration.current = 0;
      subEndTime.current = 0;
      setCurThumbSheet("01");
      setIsShown(true);
      setShowTimeStamp(false);
      setTsType("");
      setTsIndex(0);
      timeStamps.current = [];
      thumbSheetInfo.current = [];
      if(uiTimer.current != "none") {
        clearTimeout(uiTimer.current);
        uiTimer.current = "none";
      }
      uiHovered.current = false;
      document.removeEventListener("keydown", keyCheck);
      if (playerVar.current) {
        playerVar.current.destroy().then();
      }
      watchedTime.current = 0;
      intervalId.current = 0;
    };
  }, [loadData , router.asPath]);

  function getAge(birthday) {
    let today = new Date();
    let birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    let month_diff = today.getMonth() - birthDate.getMonth();
    if (month_diff < 0 || (month_diff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  function subtitleCopy(e){
    if(e.target.activeCues.length!=0){
      setSubtitle(e.target.activeCues[0]["text"]);
      subEndTime.current = e.target.activeCues[0]["endTime"];
    }
  }

  function convertTime(time) {
    let hours = 0;
    let minutes = 0;
    if(time>3600){
      hours = Math.floor(time / 3600).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      time -= Math.floor(time / 3600)*3600;
    }
    minutes = Math.floor(time / 60).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    let seconds = Math.floor(time % 60).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    return hours==0 ? `${minutes}:${seconds}`: `${hours}:${minutes}:${seconds}`;
  }

  function updateTime(e) {
    try {
      if(controllerRef.current.currentTime!=0){
        newResumeTime.current = controllerRef.current.currentTime;
      }
      document.getElementById("cur-time").innerHTML = convertTime(e.target.currentTime);
      document.getElementById("end-time").innerHTML = convertTime(e.target.duration - e.target.currentTime);
      setCurrentProg((e.target.currentTime / e.target.duration) * 100);
      let bufTime = playerVar.current.getBufferedInfo()["total"][0]["end"];
      setBufferedProg((bufTime / e.target.duration) * 100);

      if(episode_Data["timestamps"].length != 0){
        let timeStampValid = false;
        for(let i = 0; i<timeStamps.current.length; i++){
          if(timeStamps.current[i]["start_time"] <= controllerRef.current.currentTime &&
            timeStamps.current[i]["end_time"] > controllerRef.current.currentTime){
            setTsIndex(i);
            setShowTimeStamp(true);
            if(timeStamps.current[i]["ts_type"]=="opening"){
              setTsType("오프닝 건너뛰기");
            }else if(timeStamps.current[i]["ts_type"]=="recap"){
              setTsType("지난 이야기 건너뛰기");
            }else if(timeStamps.current[i]["ts_type"]=="ending"){
              setTsType("ending");
              showUI();
            }
            timeStampValid = true;
            break;
          }
        }
        if(!timeStampValid){
          setShowTimeStamp(false);
          setTsType("");
        };
      } 
      if(controllerRef.current.currentTime > subEndTime.current){
        setSubtitle("");
      }
    } catch{}
  }

  function progressMouseMove(e) {
    let curPos = document.getElementById("mouse-cur-pos");
    let preBox = document.getElementById("preview-box");
    let printTimeBox = document.getElementById("curtime-endtime");
    let prevImg = document.getElementById("preview-img");
    let currentPosition = (e.nativeEvent.offsetX / progressRef.current.offsetWidth) * totalDuration.current;
    curPos.style.display = "flex";
    curPos.style.left = `${e.nativeEvent.offsetX}px`;
    preBox.style.left = `${e.nativeEvent.offsetX - 106}px`;
    printTimeBox.innerHTML = `${convertTime(currentPosition)} / ${convertTime(totalDuration.current)}`;

    let offset = 0;
    for (let i = 0; i<= thumbSheetInfo.current.length; i++) {
      if (currentPosition < Object.values(thumbSheetInfo.current[i])[0] + 599) {
        setCurThumbSheet(Object.keys(thumbSheetInfo.current[i])[0]);
        currentPosition -= offset * 600;
        let top = `${Math.floor(currentPosition / 100) * -120}px`;
        let left = `${Math.floor((currentPosition % 100) / 10) * -213}px`;
        prevImg.style.top = top;
        prevImg.style.left = left;
        break;
      }
      offset += 1;
    }
  }

  function progressMouseClick(e) {
    setCurrentProg((e.nativeEvent.offsetX / progressRef.current.offsetWidth) * 100);
    controllerRef.current.currentTime = (e.nativeEvent.offsetX / progressRef.current.offsetWidth) * controllerRef.current.duration;
  }

  function progressMouseLeave() {
    let curPos = document.getElementById("mouse-cur-pos");
    curPos.style.display = "none";
    let preBox = document.getElementById("preview-box");
    preBox.style.display = "none";
  }

  function progressMouseEnter() {
    let preBox = document.getElementById("preview-box");
    preBox.style.display = "flex";
  }

  function hideSeekBar(id) {
    document.getElementById("seek").style.display = "none";
    let elem = document.getElementById(id);
    elem.style.display = "flex";
  }

  function showSeekBar(id) {
    document.getElementById("seek").style.display = "flex";
    let elem = document.getElementById(id);
    elem.style.display = "none";
  }

  function buttonAnimation(pic){
    setAnimation(true);
    setAnimPic(pic);
    setTimeout(()=>setAnimation(false), 250);
  }

  function play_pause() {
    try {
      if (!controllerRef.current.paused) {
        controllerRef.current.pause();
        setPlayImg(true);
        buttonAnimation("/pause.png");
      } else if (controllerRef.current.paused) {
        controllerRef.current.play();
        setPlayImg(false);
        buttonAnimation("/play_button.png");
      }
    } catch(err) {console.log(err)}
  }

  function goBackTen() {
    try {
      if (controllerRef.current.currentTime <= 10) {
        controllerRef.current.currentTime = 0;
      } else {
        controllerRef.current.currentTime -= 10;
      }
      buttonAnimation("/back10.png");
    } catch {}
  }

  function goForwardTen() {
    try {
      if (controllerRef.current.currentTime + 10 > controllerRef.current.duration) {
        controllerRef.current.currentTime = controllerRef.current.duration;
      } else {
        controllerRef.current.currentTime += 10;
      }
      buttonAnimation("/forward10.png");
    } catch {}
  }

  function fullScreen() {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function exit() {
    playerVar.current
      .destroy()
      .then(() => router.push(!isAMovie ? `/contents/${episode_Data["content"]["content_id"]}?snum=${seasonNum}`:
      `/contents/${episode_Data["content_id"]}`))
      .catch((err) => console.log(err));
  }

  function reset_and_skip(episode_id, s_num) {
    setEpId(`${episode_id}`);
    setSeasonNum(`${s_num}`);
    setQuerySeasonNum(`${s_num}`);
    router.push(`/watch/${episode_id}?snum=${s_num}`);
  }

  function keyCheck(e) {
    e.stopPropagation();
    showUI();
    if (e.code === "Space"){ 
      play_pause();
    }
    else if (e.key == "ArrowLeft") goBackTen();
    else if (e.key == "ArrowRight") goForwardTen();
    else if (e.key == "f") fullScreen();
  }

  function changeSlider(e) {
    e.stopPropagation();
    controllerRef.current.playbackRate = e.target.value;
    if (e.target.value == "1") {
      e.target.style.backgroundSize = "50%";
    } else if (e.target.value == "1.25") {
      e.target.style.backgroundSize = "75%";
    } else if (e.target.value == "1.5") {
      e.target.style.backgroundSize = "100%";
    } else if (e.target.value == "0.75") {
      e.target.style.backgroundSize = "25%";
    } else if (e.target.value == "0.5") {
      e.target.style.backgroundSize = "0%";
    }
  }

  function changeVol(e) {
    controllerRef.current.volume = e.target.value / 100;
    e.target.style.backgroundSize = `${e.target.value}%`;
    if (controllerRef.current.volume === 0) {
      setMuteImg(true);
    } else {
      setMuteImg(false);
    }
  }

  function hideUI(){
    if(!uiHovered.current && tsType!="ending"){
      uiTimer.current = setTimeout(()=>{
        try{
      setIsShown(false);
      uiTimer.current = "none";
      if(hasSubtitle){
        document.getElementById("sub-box").style.bottom = "5%";
      }}catch(err){} 
    }, 3400);}
  }

  function showUI(){
    if(uiTimer.current != "none") {
      clearTimeout(uiTimer.current);
      uiTimer.current = "none";
    }
    setIsShown(true);
    if(hasSubtitle){
      document.getElementById("sub-box").style.bottom = "17%";
    } 
    if(!controllerRef.current.paused && !uiHovered.current && tsType!="ending"){
      try{hideUI();}catch(err){}
    } 
  }

  return (
    <>
      {episode_Data_Load && (
        <div ref={containerRef} className={styles.video_container} onMouseMove={() => showUI()}>
          <video
            ref={controllerRef}
            className={styles.shaka_video}
            autoPlay
            onClick={() => play_pause()}
            onKeyDown={(e) => e.stopPropagation}
            onTimeUpdate={(e) => updateTime(e)}
            onLoadedData={() => {
              setVideoLoaded(true);
              if(episode_Data["continue"]!=null){
              controllerRef.current.currentTime = parseFloat(episode_Data["continue"]["resume_time"])*60;}
            }}
            onPlaying={() => {
              setBuffering(false);
              setPlayImg(false);
              hideUI();
            }}
            onPlay={()=>intervalId.current = setInterval(() => watchedTime.current+=1, 1000)}
            onWaiting={() => {setBuffering(true); showUI();}}
            onPause={() => {
              showUI();
              clearInterval(intervalId.current);
            }}
            onEnded={()=>{setPlayImg(true);}}
            crossOrigin="anonymous"
          >
            {hasSubtitle && subTags}
          </video>
          {!videoLoaded && (
            <div className={styles.loading_screen_container}>
              <div className={styles.black_box}></div>
              <img className={styles.loading_img} 
                src={!isAMovie ? `${props.baseURL}${episode_Data["content"]["backdrop_path"]}`:
                `${props.baseURL}${episode_Data["backdrop_path"]}`} />
              <div className={styles.bg_image}></div>
              <div className={styles.content_info}>
                <span>{!isAMovie ? `${episode_Data["season"]["season_full_title"]}: ${episode_Data["episode"]["episode_number"]}화`:
                `${episode_Data["korean_title"]}`}</span>
                <p>{!isAMovie&&episode_Data["episode"]["episode_title"]}</p>
              </div>
              <div className={styles.spinner_container}>
                <div className="spinner"></div>
                <span>로딩 중...</span>
              </div>
            </div>
          )}
          {tabShown && (
            <div className={styles.seasons_episode_tab} 
              onMouseEnter={()=>{uiHovered.current = true; showUI();}}>
              <div className={styles.seasons_button_container}>
                <button className={styles.drop_down_btn} onClick={() => setDropDownShown(!dropDownShown)}>
                  {query_season_Load && (
                    <>
                      <span>
                        {query_season_Data["season"][0]["season_type_name"] == "season" &&
                          `시즌 ${query_season_Data["season"][0]["season_number"]}`}
                      </span>
                      <Image src="/down_arrow.svg" width="12" height="12" layout="fixed" />
                    </>
                  )}
                </button>
                {dropDownShown && (
                  <div className={styles.drop_down}>
                    <ul className={styles.menu}>
                      {all_season_Data.map((season, i) => (
                        <li key={`season${i}`}>
                          <button
                            className={styles.menu_button}
                            onClick={() => {
                              setQuerySeasonNum(season["season_number"]);
                              setDropDownShown(false);
                            }}
                          >
                            {season["season_type_name"] == "season" && `시즌 ${season["season_number"]}`}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  className={styles.x_button}
                  onClick={() => {
                    setTabShown(false);
                    setDropDownShown(false);
                  }}
                >
                  <Image src="/x_button.svg" width="25" height="25" layout="fixed" />
                </button>
              </div>
              {query_season_Load &&
                query_season_Data["episodes"].map((ep, i) => (
                  <div
                    key={`ep_${i}`}
                    onClick={() => {
                      playerVar.current.destroy().then(() => reset_and_skip(ep["episode_id"], querySeasonNum));
                    }}
                  >
                    <hr />
                    <div className={styles.ep_container}>
                      <div className={styles.img_container}>
                        <img
                          src={
                            ep["video_path"].slice(-4) == ".mpd"
                              ? `${props.baseURL}/thumbnails${ep["video_path"].slice(0, -3)}jpg`
                              : `${props.baseURL}${episode_Data["content"]["backdrop_path"]}`
                          }
                        />
                        <div className={styles.progress_bar_1}></div>
                        <div className={styles.resume_bar} style={{ width: `${(ep["resume_time"]/ep["duration"]*100).toFixed(2)}%`}}></div>
                      </div>
                      <div className={styles.ep_title}>
                        <p>{`${ep["episode_number"]}화 ${ep["episode_title"]}`}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          {isShown && (
            <div
              className={styles.top_vid_controls}
              onMouseEnter={() => {
                uiHovered.current = true;
                showUI();
              }}
              onMouseLeave={() => {
                uiHovered.current = false;
                hideUI();
              }}
            > 
              <div>
              {!isAMovie &&
                  <button className={styles.top_button} onClick={() => setTabShown(true)}>
                    <div className={styles.button_wrapper}>
                      <Image src="/season_menu.svg" width="30" height="30" layout="fixed" />
                    </div>
                  </button>}
                <div className={styles.content_info}>
                  <span>{!isAMovie ? `${episode_Data["season"]["season_full_title"]}: ${episode_Data["episode"]["episode_number"]}화`:
                  `${episode_Data["korean_title"]}`}</span>
                  <p>{!isAMovie&&episode_Data["episode"]["episode_title"]}</p>
                </div>
              </div>
              <button className={styles.top_button} onClick={() => exit()}>
                <div className={styles.button_wrapper}>
                  <Image src="/x_button.svg" width="28" height="28" layout="fixed" />
                </div>
              </button>
            </div>
          )}
          {buffering && (
            <div className={styles.spinner_container}>
              <div className="spinner"></div>
              <span>로딩 중...</span>
            </div>
          )}
          <div className={styles.sub_box} id="sub-box">
            <p>{subtitle}</p>
          </div>
          {animation && (
            <div className={styles.spinner_container}>
              <Image src={animPic} width="44" height="50" layout="fixed" />
            </div>
          )}
          {showTimeStamp &&
            (tsType != "ending"?<button className={styles.skip_btn} 
            onClick={()=>controllerRef.current.currentTime = timeStamps.current[tsIndex]["end_time"]}>
              {tsType}
            </button>:
            nextButtonShown &&
            <div className={styles.ending_container}>
              <img
                src={
                  nextEp["video_path"].slice(-4) == ".mpd"
                    ? `${props.baseURL}/thumbnails${nextEp["video_path"].slice(0, -3)}jpg`
                    : `${props.baseURL}${episode_Data["content"]["backdrop_path"]}`
                }
              />
              <div className={styles.ending_info_container}>
                <div>
                  <p>다음 에피소드</p>
                  <h1>{`시즌 ${nextSeason}: ${nextEp["episode_number"]}화 ${nextEp["episode_title"]}`}</h1>
                </div>
                <div className={styles.ending_buttons_container}>
                  <button className={styles.continue_button}
                    onClick={()=>{
                      controllerRef.current.currentTime = 0;
                      if (controllerRef.current.paused) {play_pause();}
                    }}>다시 보기</button>
                  <button className={styles.next_button}
                    onClick={()=>playerVar.current.destroy().then(() => reset_and_skip(nextEp["episode_id"], nextSeason))}
                    >다음 화 재생</button>
                </div>
              </div>
            </div>)
          }
          <div
            className={styles.video_controls}
            onClick={() => setTabShown(false)}
            onMouseEnter={() => {
              uiHovered.current = true;
              showUI();
            }}
            onMouseLeave={() => {
              uiHovered.current = false;
              hideUI();
            }}
            style={{ display: isShown ? "flex" : "none" }}
          >
            <div className={styles.bot_black_bar}></div>
            <div id="seek" className={styles.seekbar}>
              <span id="cur-time" className={styles.cur_time}></span>
              <div className={styles.progress_bar}>
                <div
                  ref={progressRef}
                  className={styles.inside_progess}
                  onMouseLeave={() => progressMouseLeave()}
                  onMouseEnter={() => progressMouseEnter()}
                  onClick={(e) => progressMouseClick(e)}
                  onMouseMove={(e) => progressMouseMove(e)}
                >
                  <div id="mouse-cur-pos" className={styles.mouse_cur_pos}></div>
                  <div className={styles.buffered_progress} style={{ width: `${bufferedProg}%` }}></div>
                  <div className={styles.current_progess} style={{ width: `${currentProg}%` }}></div>
                </div>
                <div id="preview-box" className={styles.preview_box}>
                  <div className={styles.preview_img_container}>
                    <img id="preview-img" src={`${thumbSheetUrl.current}_${curThumbSheet}.jpg`} className={styles.preview_img} />
                  </div>
                  <span id="curtime-endtime"></span>
                </div>
              </div>
              <span id="end-time" className={styles.end_time}></span>
            </div>
            <div className={styles.button_controls}>
              <div className={styles.button_controls_wrapper}>
                <button
                  className={styles.play}
                  onClick={(e) => {
                    if (e.detail != 0) {
                      play_pause();
                    }
                  }}
                >
                  <div className={styles.button_wrapper}>
                    {playImg ? (
                      <Image src="/play_button.png" width="28" height="35" layout="fixed" />
                    ) : (
                      <Image src="/pause.png" width="28" height="35" layout="fixed" />
                    )}
                  </div>
                </button>
                <button
                  className={styles.back_vol_skip}
                  onClick={(e) => {
                    if (e.detail != 0) {
                      goBackTen();
                    }
                  }}
                >
                  <div className={styles.button_wrapper}>
                    <Image src="/back10.png" width="30" height="34" layout="fixed" />
                  </div>
                </button>
                <button
                  className={styles.back_vol_skip}
                  onClick={(e) => {
                    if (e.detail != 0) {
                      goForwardTen();
                    }
                  }}
                >
                  <div className={styles.button_wrapper}>
                    <Image src="/forward10.png" width="30" height="34" layout="fixed" />
                  </div>
                </button>
                <button
                  className={styles.back_vol_skip}
                  onMouseEnter={() => hideSeekBar("volume-container")}
                  onMouseLeave={() => showSeekBar("volume-container")}
                >
                  <div id="volume-container" className={styles.volume_container}>
                    <input
                      type="range"
                      className={styles.slider}
                      defaultValue={100}
                      onChange={(e) => (controllerRef.current.volume = e.target.value / 100)}
                      onInput={(e) => changeVol(e)}
                    />
                  </div>
                  <div className={styles.button_wrapper}>
                    {muteImg ? (
                      <Image src="/volume_mute.png" width="40" height="35.5" layout="fixed" />
                    ) : (
                      <Image src="/volume.png" width="40" height="35.5" layout="fixed" />
                    )}
                  </div>
                </button>
                <button
                  className={styles.back_vol_skip}
                  onClick={(e) => {
                    if (e.detail != 0) {
                      playerVar.current.destroy().then(() => reset_and_skip(nextEp["episode_id"], nextSeason));
                    }
                  }}
                  onMouseEnter={() => hideSeekBar("next-ep-container")}
                  onMouseLeave={() => showSeekBar("next-ep-container")}
                >
                  {nextButtonShown && (
                    <>
                      <div id="next-ep-container" className={styles.next_ep_container}>
                        {
                          <div className={styles.next_ep}>
                            <div className={styles.img_container}>
                              <img
                                src={
                                  nextEp["video_path"].slice(-4) == ".mpd"
                                    ? `${props.baseURL}/thumbnails${nextEp["video_path"].slice(0, -3)}jpg`
                                    : `${props.baseURL}${episode_Data["content"]["backdrop_path"]}`
                                }
                              />
                            </div>
                            <div className={styles.ep_title}>
                              <p>{`시즌 ${nextSeason}: ${nextEp["episode_number"]}화 ${nextEp["episode_title"]}`}</p>
                            </div>
                          </div>
                        }
                      </div>
                      <div className={styles.button_wrapper}>
                        <Image src="/skip.png" width="28" height="35" layout="fixed" />
                      </div>
                    </>
                  )}
                </button>
              </div>
              <div className={styles.button_controls_wrapper}>
                {hasSubtitle && (
                  <button
                    className={styles.back_vol_skip}
                    onMouseEnter={(e) => {
                      hideSeekBar("sub-container");
                      e.currentTarget.style.width = "7em";
                    }}
                    onMouseLeave={(e) => {
                      showSeekBar("sub-container");
                      e.currentTarget.style.width = "2.5em";
                    }}
                  >
                    <div id="sub-container" className={styles.sub_container}>
                      <h1>자막</h1>
                      <ul>
                        <li
                          className={subLang == "none" ? styles.selected : styles.not_selected}
                          onClick={() => {
                            setSubLang("none");
                            for (let i = 0; i < episode_Data["subtitles"].length; i++) {
                              playerVar.current.getMediaElement().textTracks[i].mode = "disabled";
                            }
                            setSubtitle("");
                          }}
                        >
                          사용 안 함
                        </li>
                        {episode_Data["subtitles"].map((subtitle, i) => (
                          <li
                            key={`subtitle_${i}`}
                            className={subLang == subtitle["language"] ? styles.selected : styles.not_selected}
                            onClick={() => {
                              setSubLang(subtitle["language"]);
                              for (let i = 0; i < episode_Data["subtitles"].length; i++) {
                                playerVar.current.getMediaElement().textTracks[i].mode = "disabled";
                              }
                              playerVar.current.getMediaElement().textTracks[i].mode = "showing";
                            }}
                          >
                            {subOptions[subtitle["language"]]}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.button_wrapper}>
                      <Image src="/sub.png" width="38" height="28" layout="fixed" />
                    </div>
                  </button>
                )}
                <button
                  className={styles.back_vol_skip}
                  onClick={(e) => {
                    if (e.detail != 0) {
                      setShowSpeed(showSpeed == "none" ? "inline" : "none");
                      setShowKey("none");
                    }
                  }}
                >
                  <div className={styles.button_wrapper}>
                    <Image src="/speed.png" width="40" height="28" layout="fixed" />
                  </div>
                  <span className={styles.speed_container} onClick={(e) => e.stopPropagation()} style={{ display: showSpeed }}>
                    <p style={{ margin: "0" }}>재생 속도</p>
                    <span className={styles.speed_slider_wrapper}>
                      <input
                        type="range"
                        className={styles.speed_slider}
                        min="0.5"
                        max="1.5"
                        defaultValue={1.0}
                        step="0.25"
                        onChange={(e) => changeSlider(e)}
                      />
                    </span>
                    <ol>
                      <li>0.5x</li>
                      <li>0.75x</li>
                      <li>1x(기본)</li>
                      <li>1.25x</li>
                      <li>1.5x</li>
                    </ol>
                  </span>
                </button>
                <button className={styles.back_vol_skip}
                onClick={(e) => {
                  if (e.detail != 0) {
                    setShowKey(showKey == "none" ? "grid" : "none");
                    setShowSpeed("none");
                  }
                }}>
                  <div className={styles.button_wrapper}>
                    <Image src="/key.png" width="40" height="28" layout="fixed" />
                  </div>
                  <span className={styles.key_container} onClick={(e) => e.stopPropagation()} style={{ display: showKey }}>
                    <div className={styles.key_info_wrapper}>
                      <div className={styles.key}>&larr;</div>
                      <div className={styles.key_info}>10초 뒤로</div>
                    </div>
                    <div className={styles.key_info_wrapper}>
                      <div className={styles.key}>&rarr;</div>
                      <div className={styles.key_info}>10초 앞으로</div>
                    </div>
                    <div className={styles.key_info_wrapper}>
                      <div className={styles.key}>&#9251;</div>
                      <div className={styles.key_info}>재생/일시정지</div>
                    </div>
                    <div className={styles.key_info_wrapper}>
                      <div className={styles.key}>f</div>
                      <div className={styles.key_info}>전체화면</div>
                    </div>
                  </span>
                </button>
                <button
                  className={styles.fullscreen}
                  onClick={(e) => {
                    if (e.detail != 0) {
                      fullScreen();
                    }
                  }}
                >
                  <div className={styles.button_wrapper}>
                    <Image src="/fullscreen.png" width="40" height="28" layout="fixed" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
