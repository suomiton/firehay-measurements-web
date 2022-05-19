import format from "date-fns/format";
import max from "date-fns/max";
import min from "date-fns/min";
import { InferGetStaticPropsType } from "next";
import { Params } from "next/dist/server/router";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Text,
  XAxis,
  YAxis,
} from "recharts";
import Chart from "../../components/chart";
import {
  FirehayLocationStatus,
  FirehayStatusAM,
} from "../../models/temperature";
import Api from "../../utils/api";

export async function getStaticPaths() {
  const statuses = await Api.get<FirehayStatusAM[]>("CurrentStatus");

  const paths = statuses.map((status) => ({
    params: { locationid: status.locationId },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps(params: Params) {
  console.log("getStaticProps", { params });
  const status = await Api.get<FirehayLocationStatus>(
    `location/${params.params.locationid}`
  );

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
  const { lastWeek } = locationStatus;
  const dateConverted = lastWeek.map((lw) => ({
    ...lw,
    timeStamp: new Date(lw.timeStamp),
  }));

  return (
    <div>
      <div className="mb-12">
        <Chart
          chartData={dateConverted}
          location={locationStatus.location}
          dataKey="temperature"
        ></Chart>
      </div>
      <div className="flex flex-row justify-evenly content-center">
        <div className="flex-auto">
          <Chart
            chartData={dateConverted}
            location={locationStatus.location}
            dataKey="humidity"
          ></Chart>
        </div>
        <div className="flex-auto">
          <Chart
            chartData={dateConverted}
            location={locationStatus.location}
            dataKey="pressure"
          ></Chart>
        </div>
      </div>
    </div>
  );
}

export default Location;
