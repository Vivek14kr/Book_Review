
import "bootstrap/dist/css/bootstrap.min.css";
import { Roboto } from "next/font/google";
import SSRProvider from "react-bootstrap/SSRProvider";
import { Router } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../styles/globals.css";
import "@fontsource/open-sans"; // Defaults to weight 400
import "@fontsource/open-sans/800.css"; // Specify weight
import "@fontsource/montserrat";
import "@fontsource/montserrat/800.css"; // Specify weight

import "@fontsource/montserrat/400.css"; // Specify weight

import "@fontsource/montserrat/500.css"; // Specify weight

import "@fontsource/montserrat/600.css"; // Specify weight

import "@fontsource/montserrat/700.css"; // Specify weight
import "@fontsource/montserrat/300.css";
import "@fontsource/open-sans/400.css"; // Specify weight

import "@fontsource/open-sans/500.css"; // Specify weight

import "@fontsource/open-sans/600.css"; // Specify weight

import "@fontsource/open-sans/700.css"; // Specify weight
import "@fontsource/open-sans/300.css";
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/inter/800.css"; // Specify weight

import "@fontsource/inter/400.css"; // Specify weight

import "@fontsource/inter/500.css"; // Specify weight

import "@fontsource/inter/600.css"; // Specify weight

import "@fontsource/inter/700.css"; // Specify weight
import "@fontsource/inter/300.css";
import "@fontsource/roboto"; // Defaults to weight 400


import "@fontsource/roboto/400.css"; // Specify weight

import "@fontsource/roboto/500.css"; // Specify weight


import "@fontsource/roboto/700.css"; // Specify weight
import "@fontsource/roboto/300.css";

import {GoogleAnalytics} from "nextjs-google-analytics"; // Specify weight
import Navbar from "@/components/Navbar";


NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});

Router.events.on('routeChangeError', () => {
  NProgress.done();
});
const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
export default function App({ Component, pageProps }) {
  return (
    <SSRProvider>
      {" "}
      <main className={roboto.className}>
    
          <Component {...pageProps} />
    
      </main>
    </SSRProvider>
  );

}
