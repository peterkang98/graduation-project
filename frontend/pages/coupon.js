import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import TopNavigation from "../components/TopNavigation";
import styles from "../styles/Coupon.module.css";

export default function search(props) {
  const [couponCode, setCouponCode] = useState("");
  const [showWrongCoupon, setShowWrongCoupon] = useState(false);
  const [wrongCouponText, setWrongCouponText] = useState("쿠폰 코드를 다시 확인해주세요");
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);
  const [couponSuccessText, setCouponSuccessText] = useState("쿠폰 코드를 다시 확인해주세요");

  function submit(e) {
    e.preventDefault();
    if (couponCode.length == 0) {
      setShowWrongCoupon(true);
      setWrongCouponText("쿠폰 코드를 입력해주세요");
      return;
    }
    axios
      .post(`${props.baseURL}/coupons`, { code: couponCode }, {headers: { Authorization: props.userSession["auth_token"] }})
      .then((res) => {
        setShowWrongCoupon(false);
        setShowCouponSuccess(true);
        setCouponSuccessText(`쿠폰 코드: ${couponCode}를 성공적으로 사용했습니다!!`);
      })
      .catch((err) => {
        setShowWrongCoupon(true);
        setWrongCouponText("존재하지 않는 쿠폰 코드입니다. 다시 한번 확인 부탁드립니다.");
        if(err.response.data.message=="already used"){
            setWrongCouponText("이미 사용한 쿠폰 코드입니다.");
        }
      });
  }

  return (
    <div className={styles.main_page}>
      <Navbar curPage={""} />
      <TopNavigation logOut={props.onLogOut} userSession={props.userSession} />
      <main className={styles.page_container}>
        <section className={styles.coupon_container}>
          <div className={styles.top_text}>쿠폰을 받으셨나요? 쿠폰 코드를 등록해보세요!</div>
          <form className={styles.coupon_form} onSubmit={(e) => submit(e)}>
            <input
              name="coupon"
              onChange={(e) => setCouponCode(e.target.value)}
              className={styles.coupon_input}
              autoComplete="off"
              placeholder="쿠폰 코드"
              type="text"
              value={couponCode}
            />
            <button type="submit" className={styles.form_submit}>
              등록하기
            </button>
          </form>
          <hr />
          <div className={styles.coupon_info}>*쿠폰 코드는 계정당 1회만 등록 가능합니다*</div>
          {showWrongCoupon && <div className={styles.coupon_warning}>{wrongCouponText}</div>}
          {showCouponSuccess && <div className={styles.coupon_success}>{couponSuccessText}</div>}
        </section>
      </main>
    </div>
  );
}
