import { InferGetStaticPropsType } from "next";
import { Params } from "next/dist/server/router";
import { useRouter } from "next/router";
import { FirehayLocationStatus, FirehayStatus } from "../../models/temperature";
import Api from "../../utils/api";

export async function getStaticPaths() {
  const statuses = await Api.get<FirehayStatus[]>("CurrentStatus");

  const paths = statuses.map((status) => ({
    params: { locationid: status.locationId },
  }));

  return { paths, fallback: false }
}

export async function getStaticProps(params: Params) {
  console.log("getStaticProps", { params });
  const status = await Api.get<FirehayLocationStatus>(`location/${params.params.locationid}`);

  return {
    props: {
      locationStatus: status,
    },
  };
}

function Location({
  locationStatus,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log({ locationStatus });
  return <div className=""></div>;
}

export default Location;
