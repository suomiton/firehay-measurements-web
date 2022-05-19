import formatDistance from "date-fns/formatDistance";
import type { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { ClientExtendedStatus, FirehayStatusAM } from "../models/temperature";
import { ListItemSlideIn, ListItemZoom } from "../utils/animations";
import Api from "../utils/api";

type LinkItemProps = { isMobile: boolean; status: ClientExtendedStatus };

function LinkItem({
  status: {
    locationId,
    temperature,
    location,
    timeStampDistance,
    temperatureRatio,
    pressure,
    humidity,
  },
  isMobile,
}: LinkItemProps) {
  return (
    <Link href={`/location/${locationId}`}>
      <a className="grid grid-flow-row grid-cols-10 md:grid-cols-5 gap-8 bg-gradient-to-r md:bg-gradient-to-b from-gray-100 to-orange-100 p-2 md:p-4">
        <div className="col-span-4 sm:col-span-2 md:col-span-5 flex flex-col text-right self-center md:order-1">
          {isMobile ? (
            <div className="font-bold text-4xl">
              {Math.floor(temperature)} &deg;C
            </div>
          ) : (
            <div className="flex flex-row">
              <div className="flex-initial self-center text-xs font-light leading-tight text-left">
                <div className="text-gray-700">Humidity</div>
                <div className="font-medium">{humidity} %</div>
                <div className="text-gray-700">Pressure</div>
                <div className="font-medium">{pressure} hPa</div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-7xl self-center">
                  {Math.floor(temperature)} &deg;C
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-6 sm:col-span-8 md:col-span-5 flex flex-col justify-start content-center">
          <div className="flex-auto">
            <span className="text-xl">{location}</span>
          </div>
          {isMobile && (
            <div className="flex-auto text-xs font-light">
              <span>{humidity} %</span>
              <span className="ml-4">{pressure} hpa</span>
            </div>
          )}
          <div className="flex-auto">
            <span className="text-xs font-light">{timeStampDistance}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}

function StatusListItem({
  status,
  index,
}: {
  status: ClientExtendedStatus;
  index: number;
}) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const className = "mb-4 shadow-lg rounded-md overflow-hidden border bg-gray-100";

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

function Home({ statuses }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <ul className="md:grid grid-flow-col md:grid-flow-row md:grid-cols-3 xl:grid-cols-5 gap-4">
        {statuses.map((s, idx) => (
          <StatusListItem key={s.locationId} status={s} index={idx} />
        ))}
      </ul>
    </div>
  );
}

export default Home;

export const getStaticProps = async () => {
  const statuses = await Api.get<FirehayStatusAM[]>("CurrentStatus");
  const extendedStatus: ClientExtendedStatus[] = statuses.map((status) => ({
    ...status,
    timeStampDistance: formatDistance(new Date(status.timeStamp), new Date()),
  }));

  return {
    props: {
      statuses: extendedStatus,
    },
  };
};
