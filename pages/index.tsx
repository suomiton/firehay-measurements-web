import type { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import TrendIndicator from "../components/trend-indicator";
import { FirehayStatusAM } from "../models/temperature";
import { ListItemSlideIn, ListItemZoom } from "../utils/animations";
import Api from "../utils/api";
import { DateDistance } from "../utils/date";

type LinkItemProps = { isMobile: boolean; status: FirehayStatusAM };

function LinkItem({
  status: {
    locationId,
    temperature,
    locationName,
    timeStamp,
    temperatureRatio,
    pressure,
    humidity,
  },
  isMobile,
}: LinkItemProps) {
  const resolveBgGradient = (temperature: number) => {
    let color = "blue";
    let magnitude = "100";

    if (temperature >= 24) {
      color = "red";
      magnitude = `${(temperature + 2 - 23) * 100}`;
    } else if (temperature >= 20) {
      color = "orange";
      magnitude = `${(temperature - 19) * 100}`;
    } else if (temperature >= 15) {
      color = "blue";
      magnitude = `${Math.abs(temperature - 20) * 100}`;
    } else {
      color = "blue";
      magnitude = "500";
    }
    return `to-${color}-${magnitude}`;
  };

  return (
    <Link href={`/location/${locationId}`}>
      <a
        className={`flex flex-row md:flex-col content-center gap-8 bg-gradient-to-r md:bg-gradient-to-br from-white ${resolveBgGradient(
          parseInt(temperature.toString(), 10)
        )} p-2 px-4 md:p-4 relative`}
      >
        <div className="flex-initial md:flex-auto md:min-w-full flex flex-col text-right self-center md:order-1">
          {isMobile ? (
            <div className="flex flex-row gap-4">
              <div className="flex-initial self-center">
                <TrendIndicator ratio={temperatureRatio} />
              </div>
              <div className="flex-auto self-center font-bold text-4xl">
                {Math.floor(temperature)} &deg;C
              </div>
            </div>
          ) : (
            <div className="flex flex-row">
              <div className="flex-initial self-center text-xs font-light leading-tight text-left">
                <div className="text-gray-700">Humidity</div>
                <div className="font-medium">{humidity} %</div>
                <div className="text-gray-700">Pressure</div>
                <div className="font-medium">{pressure} hPa</div>
              </div>
              <div className="flex-1 self-center">
                <div className="font-bold text-5xl lg:text-7xl xl:text-5xl self-center">
                  {Math.floor(temperature)} &deg;C
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex-auto flex flex-col justify-start content-center">
          <div className="flex-auto">
            <span className="text-xl leading-none">{locationName}</span>
          </div>
          {isMobile && (
            <div className="flex-auto text-xs font-light">
              <span>{humidity} %</span>
              <span className="ml-4">{pressure} hpa</span>
            </div>
          )}
          <div className="flex-auto">
            <span className="text-xs font-light">
              {DateDistance(timeStamp)}
            </span>
          </div>
        </div>
        {!isMobile && (
          <div className="absolute top-4 right-4">
            <TrendIndicator ratio={temperatureRatio} />
          </div>
        )}
      </a>
    </Link>
  );
}

function StatusListItem({
  status,
  index,
}: {
  status: FirehayStatusAM;
  index: number;
}) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const className =
    "mb-4 shadow-lg rounded-md overflow-hidden border bg-gray-100";

  return isMobile ? (
    <ListItemSlideIn index={index} className={className}>
      <LinkItem status={status} isMobile={isMobile} />
    </ListItemSlideIn>
  ) : (
    <ListItemZoom index={index} className={className}>
      <LinkItem status={status} isMobile={isMobile} />
    </ListItemZoom>
  );
}

function ExternalStatus({
  temperature,
  humidity,
  pressure,
  timeStamp,
}: FirehayStatusAM) {
  return (
    <div className="grid grid-flow-row grid-cols-5 gap-8">
      <div className="col-span-5 flex flex-col justify-start content-center">
        <div className="flex-auto">
          <span className="text-xs font-light">{DateDistance(timeStamp)}</span>
        </div>
      </div>
      <div className="col-span-4 sm:col-span-2 md:col-span-5 flex flex-col text-right self-center">
        <div className="flex flex-row">
          <div className="flex-initial self-center text-xs font-light leading-tight text-left">
            <div className="text-gray-200">Humidity</div>
            <div className="font-medium">{humidity} %</div>
            <div className="text-gray-200">Pressure</div>
            <div className="font-medium">{pressure} hPa</div>
          </div>
          <div className="flex-1 self-center">
            <div className="font-bold text-5xl md:text-7xl self-center">
              {Math.floor(temperature)} &deg;C
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type LocationTypeTuple = [FirehayStatusAM | null, FirehayStatusAM[]];

function Home({ statuses }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [extStatus, intStatuses] = statuses.reduce(
    (acc: LocationTypeTuple, cur: FirehayStatusAM) => {
      cur.isExternal ? (acc[0] = cur) : acc[1].push(cur);
      return acc;
    },
    [null, []]
  );

  return (
    <div>
      <ul className="md:grid grid-flow-col md:grid-flow-row md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {intStatuses.map((s, idx) => (
          <StatusListItem key={s.locationId} status={s} index={idx} />
        ))}
      </ul>
      {extStatus && (
        <div className="bg-slate-800 text-white p-4 rounded-md">
          <h1>Outside</h1>
          <ExternalStatus {...extStatus} />
        </div>
      )}
    </div>
  );
}

export default Home;

export const getStaticProps = async () => {
  const statuses = await Api.get<FirehayStatusAM[]>("CurrentStatus");

  return {
    props: {
      statuses,
    },
  };
};
