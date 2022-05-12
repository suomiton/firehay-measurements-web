import formatDistance from "date-fns/formatDistance";
import type { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { ClientExtendedStatus, FirehayStatus } from "../models/temperature";
import { ListItemSlideIn, ListItemZoom } from "../utils/animations";
import Api from "../utils/api";

export const getStaticProps = async () => {
  const statuses = await Api.get<FirehayStatus[]>("CurrentStatus");
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

function LinkItem({
  status: { locationId, temperature, location, timeStampDistance },
}: {
  status: ClientExtendedStatus;
}) {
  return (
    <Link href={`/location/${locationId}`}>
      <a className="grid grid-flow-row grid-cols-5 gap-8 bg-gradient-to-r md:bg-gradient-to-b from-blue-100 to-orange-100 py-2 md:p-4">
        <div className="col-span-1 md:col-span-5 text-right self-center md:order-1">
          <span className="font-bold text-4xl md:text-7xl">
            {Math.floor(temperature)}&deg;C
          </span>
        </div>
        <div className="col-span-4 md:col-span-5 flex flex-col justify-start content-center">
          <div className="flex-auto">
            <span className="text-xl">{location}</span>
          </div>
          <div className="flex-auto">
            <span className="text-xs">{timeStampDistance}</span>
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
  const className = "mb-4 shadow-sm rounded-md overflow-hidden";

  return isMobile ? (
    <ListItemSlideIn index={index} className={className}>
      <LinkItem status={status} />
    </ListItemSlideIn>
  ) : (
    <ListItemZoom index={index} className={className}>
      <LinkItem status={status} />
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
