import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/globals.css";
import Head from "next/head";
import { QueryClientProvider, QueryClient } from "react-query";
import { useRouter } from "next/router";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const baseURL = "http://localhost:8430";
  const router = useRouter();
  const [session, setSession] = useState({
    auth_token: null,
    user: {
      id: null,
      email: null,
      membership_time_left: null,
      username: null,
      birthday: null
    },
    isLoggedIn() {
      const loggedOut = session.auth_token == null || session.auth_token == JSON.stringify(null);
      return !loggedOut;
    },
  });

  useEffect(() => {
    let localAuthToken = localStorage.getItem("auth_token");
    let cookieExists = localAuthToken !== "undefined" && localAuthToken !== null;
    if (cookieExists) {
      axios
        .get(`${baseURL}/member-data`, {
          headers: { Authorization: localAuthToken },
        })
        .then((res) => {
          if(session["auth_token"]==null||(session.user.membership_time_left != res.data.user.membership_time_left)){
            setSession({
              auth_token: res.config.headers.Authorization,
              user: res.data.user,
            });
          }
          if (router.pathname === "/" || router.pathname === "/sign_in" || router.pathname == "/sign_up") {
            router.push("/browse/video");
          }
        })
        .catch((err) => {
          if(err.response.data!=undefined && err.response.data=="Signature has expired"){
            alert("세션이 만료되었습니다. 다시 로그인 해주세요");
            localStorage.removeItem("auth_token");
            router.push("/");
          }
        })
    }else{
      if (!(router.pathname == "/" || router.pathname == "/sign_in"|| router.pathname == "/sign_up")) {
      router.push("/sign_in");}
    }
  }, [router.asPath]);

  function setUserInfo(payload) {
    setSession({
      auth_token: payload.headers.authorization,
      user: payload.data.user,
    });
    localStorage.setItem("auth_token", payload.headers.authorization);
    if (session.isLoggedIn) {
      router.push("/browse/video");
    }
  }

  function logOutUser() {
    axios
      .delete(`${baseURL}/users/sign_out`, {
        headers: { Authorization: session["auth_token"] },
      })
      .then(() => {
        setSession({
          auth_token: null,
          user: {
            id: null,
            email: null,
            membership_enabled: null,
            membership_time_left: null,
            username: null
          },
          isLoggedIn() {
            const loggedOut =
              session.auth_token == null ||
              session.auth_token == JSON.stringify(null);
            return !loggedOut;
          },
        });
        localStorage.removeItem("auth_token");
        router.push("/sign_in");
      })
      .catch((err) => {
        console.log(err);
        router.push("/sign_in");
      });
  }

  function membershipTimeCountDown(time){
    time /=60;
    axios
        .post(`${baseURL}/membership_countdown`, {"time":time}, {headers: { Authorization: session.auth_token}})
        .then(() => {})
        .catch((err) => {
          console.log(err);
        })
  }

  return (
    <>
      <Head>
        <title>웨비</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component
          {...pageProps}
          userSession={session}
          baseURL={baseURL}
          onLogIn={(payload) => setUserInfo(payload)}
          onLogOut={logOutUser} client={queryClient}
          memTimeMinus={(time)=>membershipTimeCountDown(time)}
        />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
