import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import styles from "../styles/HomeCards.module.css";

export default function HomeCards(props) {
  const cardRef = useRef(null);
  const [cardX, setCardX] = useState(0);

  function scrollLeft() {
    if (cardX == 0) {
      cardRef.current.style.transform = `translate3d(${cardX - 100}%, 0px, 0)`;
      setCardX(cardX - 100);
    }
  }

  function scrollRight() {
    if (cardX == -100) {
      cardRef.current.style.transform = `translate3d(${cardX + 100}%, 0px, 0)`;
      setCardX(cardX + 100);
    }
  }

  return (
    <section>
      <div className={styles.card_button_container}>
        <button className={styles.left_button} onClick={() => scrollRight()}>
          <Image src="/left_arrow.svg" width="15" height="40" />
        </button>
        <ul ref={cardRef} className={styles.card_container}>
          {props.cardData.map(card => (
            <li key={card["card_id"]}>
              <Link href={`/playlists/${card["card_id"]}`}>
                <div className={styles.card}>
                  <span>{card["card_subtitle"]}</span>
                  <h4>{card["card_title"]}</h4>
                  <p>{card["card_description"]}</p>
                  <img
                    src={`${props.baseURL}/${card["card_image_path"]}`} className={styles.card_image}
                  ></img>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <button className={styles.right_button} onClick={() => scrollLeft()}>
          <Image src="/right_arrow.svg" width="15" height="40" />
        </button>
      </div>
    </section>
  );
}
