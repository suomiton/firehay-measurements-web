import Head from "next/head";
import { PropsWithChildren, useEffect, useState } from "react";
import Header from "../components/header";
import styles from "../styles/Home.module.css";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Status - Firehay</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        {children}
      </main>

      <footer></footer>
 
    </div>
  );
}