import format from "date-fns/format";
import { InferGetStaticPropsType } from "next";
import { Params } from "next/dist/server/router";
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
  const {
    lastWeek,
    locationName,
    humidity,
    pressure,
    temperature,
    temperature24Avg,
    temperature6Avg,
    temperatureUnit,
    humidityUnit,
    pressureUnit,
    timeStamp,
  } = locationStatus;
  
  const dateConverted = lastWeek.map((lw) => ({
    ...lw,
    timeStamp: new Date(lw.timeStamp),
  }));

  return (
    <div>
      <div className="mt-4 mb-8">
        <h1>{locationName}</h1>
      </div>
      <div className="bg-slate-100 p-4 mb-8">
        <h2 className="mb-4">
          Status {format(new Date(timeStamp), "dd.MM.yyyy HH:mm")}
        </h2>
        <div className="grid grid-flow-row grid-cols-2 md:grid-cols-3 bg-slate-100 gap-4">
          <div className="flex flex-col">
            <label className="flex-auto">Temperature</label>
            <div className="flex-auto">{temperature} {temperatureUnit}</div>
          </div>
          <div className="flex flex-col">
            <label className="flex-auto">Temperature avg. 6h</label>
            <div className="flex-auto">{temperature6Avg} {temperatureUnit}</div>
          </div>
          <div className="flex flex-col">
            <label className="flex-auto">Temperature avg. 24h</label>
            <div className="flex-auto">{temperature24Avg} {temperatureUnit}</div>
          </div>
          <div className="flex flex-col">
            <label className="flex-auto">Humidity</label>
            <div className="flex-auto">{humidity} {humidityUnit}</div>
          </div>
          <div className="flex flex-col">
            <label className="flex-auto">Pressure</label>
            <div className="flex-auto">{pressure} {pressureUnit}</div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="mb-4">Measurement Trends</h2>
        <div>
          <div className="mb-12 2xl:max-w-7xl 2xl:mx-auto">
            <Chart
              chartData={dateConverted}
              location={locationName}
              dataKey="temperature"
              showLegend
              unit={temperatureUnit}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-evenly content-center">
            <div className="flex-auto md:w-1/2">
              <Chart
                chartData={dateConverted}
                location={locationName}
                dataKey="humidity"
                unit={humidityUnit}
              />
            </div>
            <div className="flex-auto md:w-1/2">
              <Chart
                chartData={dateConverted}
                location={locationName}
                dataKey="pressure"
                unit={pressureUnit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
