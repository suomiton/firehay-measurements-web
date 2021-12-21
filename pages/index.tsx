import type { InferGetStaticPropsType } from "next";
import Api from "../utils/api";

type FirehayStatus = {
  id: string;
  locationId: string;
  location: string;
  tempCurrent: number;
  temp6Avg: number;
  temp24Avg: number;
  pressureCurrent: number;
  humidityCurrent: number;
  currentTimeStamp: string;
};

export const getStaticProps = async () => {
  const statuses = await Api.get<FirehayStatus[]>('CurrentStatus');
  
  return {
    props: {
      statuses,
    },
  };
};

function Home({ statuses }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
      statuses.map(s => (<p key={s.id}>{s.tempCurrent}</p>))
  );
}

export default Home;
