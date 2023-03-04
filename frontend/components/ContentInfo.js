import styles from "../styles/ContentInfo.module.css";

export default function ContentInfo(props) {
  return (
    <section className={styles.sec_container}>
      <h2>감독 / 출연</h2>
      <div className={styles.grid_container}>
        {props.people.map((person, i) => (
          <div className={styles.person_container} key={i}>
            <div className={styles.img_container}>
              <img src={props.baseURL + person["picture_path"]} />
            </div>
            <div className={styles.person_info_container}>
              <p>{person["name"]}</p>
              <span>
                {person["role"] == "actor"
                  ? `출연 · ${person["character_name"]}`
                  : person["role"] == "voiceactor"
                  ? `성우 · ${person["character_name"]}`
                  : "감독"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
