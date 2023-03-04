import styles from "../styles/SimilarContents.module.css";
import Carousel from "./Carousel";
import {useState, useRef, useEffect} from "react";


export default function SimilarContents(props) {
  const contentsLen = useRef();
  const carouselTags = useRef([]);
  const [showTags, setShowTags] = useState(false);
  
  useEffect(()=>{
    if(props.data["contents"].length > 0 ){
      contentsLen.current = Math.ceil(props.data["contents"].length/6);
      for(let i = 0; i<contentsLen.current; i++){
        let json_data = {"playlist":{"playlist_title": ''}}
        let remainder = (props.data["contents"].length-(6*i))%(6)
        if(contentsLen.current > i + 1){
          json_data["contents"] = props.data["contents"].slice(i*6, 6*(i+1))
        }else{
          if(remainder == 0){
            json_data["contents"] = props.data["contents"].slice(i*6, 6*(i+1))
          }else{
            json_data["contents"] = props.data["contents"].slice(i*6, (i*6)+remainder)
          }
        }
        carouselTags.current.push(<Carousel key={`related_row${i}`} baseURL={props.baseURL} cardData={json_data}/>);
      }
    }else{
      contentsLen.current = 0;
      carouselTags.current = (<></>);
    }
    setShowTags(true);
  }, [props.data])

  return (
    !showTags ? (
      <div className={styles.spinner_container}>
        <div className="spinner"></div>
        <h1>로딩 중...</h1>
      </div>
    ):(
    <section className={styles.sec_container}>
      <h2>{props.title}</h2>
      {carouselTags.current.map((carousel)=>carousel)}
    </section>)
  );
}