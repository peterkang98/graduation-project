import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect} from "react";
import styles from "../styles/HomeCards.module.css";
import styles2 from "../styles/Carousel.module.css";
import { useRouter } from "next/router";

export default function Carousel(props) {
  const router = useRouter();
  const cardRef = useRef(null);
  const [cardX, setCardX] = useState(0);
  const [totalCardNum, setTotalCardNum] = useState(props.cardData["contents"].length);
  const cardOffset = useRef(6);
  const cardPageNum = useRef(Math.floor(totalCardNum/6));
  const [showDetails, setShowDetails] = useState(new Array(totalCardNum).fill(false));
  let clearTimerRef = useRef(null);
  const [cardNum, setCardNum] = useState(0);
  let cards = [];
  for (let i = 0; i < totalCardNum; i++) {
    cards[i] = useRef(null);
  }
  function scrollLeft() {
    if (cardNum<(6*cardPageNum.current)) {
      cardRef.current.style.transform = `translate3d(${cardX - 100}%, 0px, 0)`;
      setCardX(cardX - 100);
      setCardNum(cardNum + 6);
    }
  }

  function scrollRight() {
    if (cardNum>=6) {
      cardRef.current.style.transform = `translate3d(${cardX + 100}%, 0px, 0)`;
      setCardX(cardX + 100);
      setCardNum(cardNum - 6);
    }
  }

  function EnlargeImage(e) {
    let curCard = e.currentTarget;
    resetTransition();
    curCard.firstElementChild.firstElementChild.style.filter = "opacity(50%)";
    curCard.style.zIndex = "4";
    clearTimerRef.current = setTimeout(() => {
      try{if (curCard == cards[cardNum+0].current) {
        curCard.style.left = "3%";
        curCard.style.transform = "scale(1.3)";
        
        for (let i = 1+cardNum; i < cardOffset.current+cardNum; i++) {
          cards[i].current.style.left = "5.4%";
        }
        setShowDetails(prev => {
          let arr = [...prev];
          arr[cardNum+0] = true;
          return arr;
        });
      }else if (cardOffset.current>=6 && curCard == cards[cardNum+5].current) {
        if((curCard == cards[cardNum+5].current)){
          curCard.style.left = "-3%";
          curCard.style.transform = "scale(1.3)";
          
          for (let i = cardNum+4; i >=cardNum+0; i--) {
            cards[i].current.style.left = "-5.4%";
          }
          setShowDetails(prev => {
            let arr = [...prev];
            arr[cardNum+5] = true;
            return arr;
          });
        }
      }else{
        let x = parseInt(curCard.id.slice(4)) - 1; 
        curCard.style.left = "-1%";
        curCard.style.transform = "scale(1.3)";
        
        for(let j = x; j>=cardNum+0; j--){
          cards[j].current.style.left = "-3.5%";
        }
        for (let i = (x+2); i < cardNum+cardOffset.current; i++) {
          cards[i].current.style.left = "1.5%";
        }
        setShowDetails(prev => {
          let arr = [...prev];
          arr[x+1] = true;
          return arr;
        });
      }}catch(err){console.log(err)}
    }, 480) 
  }

  function ShrinkImage(e) {
    e.currentTarget.firstElementChild.lastElementChild.style.filter = "opacity(100%)"
    quickTransition();
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.zIndex = "3";
    for (let i = 0; i < totalCardNum; i++) {
      cards[i].current.style.left = "0%";
    }
    clearTimeout(clearTimerRef.current);
    setShowDetails(new Array(totalCardNum).fill(false));
  }

  function quickTransition(){
    try{for (let i = 0; i < totalCardNum; i++) {
      cards[i].current.style.transition = "transform 0.2s cubic-bezier(0.5, 0, 0.1, 1) 0s, left 0.2s cubic-bezier(0.5, 0, 0.1, 1) 0s";
    }}catch(err){}
  }

  function resetTransition(){
    try{for (let i = 0; i < totalCardNum; i++) {
      cards[i].current.style.transition = "transform 0.5s cubic-bezier(0.5, 0, 0.1, 1) 0s, left 0.5s cubic-bezier(0.5, 0, 0.1, 1) 0s";
    }}catch(err){}
  }

  function TimeConversion(min){
    if(min <= 60){
      return `${min}분`;
    }else{
      if(min%60 == 0){
        return `${min/60}시간`;
      }else{
        const hour = Math.floor(min/60);
        const minute = min%60;
        return `${hour}시간 ${minute}분`;
      }
    }
  }

  useEffect(()=>{
    let remaindCardNum = totalCardNum - cardNum;
    if(remaindCardNum >= 6){
      cardOffset.current = 6;
    }else{
      cardOffset.current = remaindCardNum;
    }
  },[cardNum]);

  return (
    <section className={styles2.carousel_container}>
      {"playlist" in props.cardData &&
      <h2 className={styles2.playlist_title}>
        {props.cardData["playlist"]["playlist_title"]}
      </h2>}
      <div className={styles.card_button_container}>
      {cardNum>=6 && 
      <button className={styles.left_button} onClick={() => scrollRight()}>
          <Image src="/left_arrow.svg" width="15" height="40" />
        </button>}
        <ul ref={cardRef} className={styles2.card_container}>
          {props.cardData["contents"].map((poster, i) => (
            <li onMouseEnter={(e) => EnlargeImage(e)} onMouseLeave={(e) => ShrinkImage(e)}
              key={props.cardData["playlist"]["playlist_title"]!="이어보기"?
              poster["content_id"] + 4:
              poster["updated"]} id={`card${i}`} ref={cards[i]}>
              {props.cardData["playlist"]["playlist_title"]!="이어보기"?
              <Link href={(poster["is_a_movie"]&&`/contents/${poster["content_id"]}`)||(!poster["is_a_movie"]&&`/contents/${poster["content_id"]}?snum=1`)}>
                <div className={styles.card}>
                  {showDetails[i] && 
                  <div className={styles2.info_container}>
                    <h3>
                      <div>{poster["korean_title"]}</div>
                        <Image src={(poster["maturity_rating"] =="15" && "/fifteen.svg")||
                      (poster["maturity_rating"] =="12" && "/twelve.svg")||
                      (poster["maturity_rating"] =="ALL" && "/all.svg")||
                      (poster["maturity_rating"] =="18" && "/eightteen.svg")
                      } width="20" height="20" />
                    </h3>
                    <span className={styles2.duration_info}>{poster["is_a_movie"] ? TimeConversion(poster["duration_or_episodes"])
                    :`에피소드 ${poster["duration_or_episodes"]}개 · 시즌 ${poster["number_of_seasons"]}개`}</span>
                    {poster["categories"].length!=0 &&
                    <p>
                      {poster["categories"].slice(0, 2).map((category)=>`${category["category_name"]} · `)}{poster["categories"][2]["category_name"]}
                    </p>}
                  </div>}
                  <img src={`${props.baseURL}${poster["poster_path"]}`}/>
                </div>
              </Link>:<>
              <Link href={poster["movie_id"]!=null ? `/watch/${poster["content_id"]}`:`/watch/${poster["episode_id"]}?snum=${poster["season_number"]}`}>
              <div className={styles.card}> 
              {showDetails[i] && 
                  <div className={styles2.info_container}>
                    <div>
                      <button className={styles2.play_or_plus} onClick={()=>router.push(poster["movie_id"]!=null ? `/watch/${poster["content_id"]}`:`/watch/${poster["episode_id"]}?snum=${poster["season_number"]}`)}>
                        <Image src="/poster_play.svg" width="28" height="28" />
                      </button>
                    </div>
                    <h3>
                      <div>{poster["movie_id"]!=null?poster["korean_title"]:poster["season_full_title"]}</div>
                    </h3>
                    <span className={styles2.duration_info}>{poster["movie_id"]!=null?`${TimeConversion(poster["duration_or_episodes"])} 중 ${TimeConversion(Math.floor(poster["resume_time"]))}`:
                    `시즌 ${poster["season_number"]}: 에피소드 ${poster["episode_number"]}`} </span>
                  </div>}
                <img src={poster["movie_id"]!=null?`${props.baseURL}${poster["poster_path"]}`:`${props.baseURL}${poster["season_poster_path"]}`}/>
              </div>
            </Link>
            <div className={styles2.bar_container}></div>
            <div className={styles2.progress_container} style={{ width: poster["movie_id"]!=null?`${(poster["resume_time"]/poster["duration_or_episodes"]*100).toFixed(2)}%`:`${(poster["resume_time"]/poster["duration"]*100).toFixed(2)}%`}}></div></>
              }
            </li>
          ))}
        </ul>
        {(totalCardNum - cardNum)>6 &&
        <button className={styles.right_button} onClick={() => scrollLeft()}>
          <Image src="/right_arrow.svg" width="15" height="40" />
        </button>}
      </div>
    </section>
  );
}