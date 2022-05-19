import { subHours } from "date-fns";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import RoundButton from "./round-button";

export type DataPointKey = "temperature" | "humidity" | "pressure";

interface TimeStamped {
  timeStamp: Date;
}

export type ChartData = TimeStamped & Record<DataPointKey, number>;

interface ChartProps {
  chartData: ChartData[];
  location: string;
  dataKey: DataPointKey;
}

enum PeriodOptions {
  SixHours = "6h",
  Day = "24h",
  ThreeDays = "3d",
  Week = "1w",
}

type ChartDataWithTicks = ChartData & { tick: string };

interface PeriodState {
  selectedPeriod: PeriodOptions;
  dataSet: ChartDataWithTicks[];
}

function Chart({ chartData, location, dataKey }: ChartProps) {
  const [periodState, setPeriodState] = useState<PeriodState>({
    selectedPeriod: PeriodOptions.SixHours,
    dataSet: ResolveTicks(PeriodOptions.SixHours, FilterDataSet(PeriodOptions.SixHours, chartData)),
  });

  useEffect(() => {
    const dataSet = ResolveTicks(periodState.selectedPeriod, FilterDataSet(periodState.selectedPeriod, chartData));
    setPeriodState((prevState) => ({
      ...prevState,
      dataSet
    }));
  }, [periodState.selectedPeriod]);

  const { selectedPeriod, dataSet } = periodState;

  return (
    <div>
      <div className="flex flex-row justify-between content-center mx-8 mb-4">
        <h1 className="flex-initial self-center font-semibold text-lg capitalize">
          {dataKey}
        </h1>
        <div className="flex-initial">
          {Object.values(PeriodOptions).map((period) => (
            <RoundButton
              key={period}
              value={period}
              isActive={selectedPeriod === period}
              onClick={() =>
                setPeriodState({ ...periodState, selectedPeriod: period })
              }
            >
              {period}
            </RoundButton>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" aspect={100 / 60}>
        <LineChart data={dataSet} margin={{ right: 30 }}>
          <Line
            name={location}
            type="monotone"
            dataKey={dataKey}
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          <Line
            name="Outside"
            type="monotone"
            dataKey={`${dataKey}Ext`}
            stroke="#bbb"
            strokeWidth={2}
            dot={false}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis
            dataKey="tick"
            angle={45}
            height={100}
            tickMargin={25}
          />
          <YAxis tickCount={9} domain={['auto', 'auto']} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function FilterDataSet(
  selectedPeriod: PeriodOptions,
  chartData: ChartData[]
): ChartData[] {
  const current = new Date();
  switch (selectedPeriod) {
    case PeriodOptions.SixHours:
      return chartData.filter((d) => subHours(current, 6) < d.timeStamp);
    case PeriodOptions.Day:
      return chartData.filter((d) => subHours(current, 24) < d.timeStamp);
    case PeriodOptions.ThreeDays:
      return chartData.filter((d) => subDays(current, 3) < d.timeStamp);
    case PeriodOptions.Week:
    default:
      return chartData;
  }
}

function ResolveTicks(
  selectedPeriod: PeriodOptions,
  chartData: ChartData[]
): ChartDataWithTicks[] {
  switch (selectedPeriod) {
    case PeriodOptions.SixHours:
    case PeriodOptions.Day:
      return chartData.map((d) => ({ ...d, tick: format(d.timeStamp, "HH:mm")}));
    case PeriodOptions.ThreeDays:
    case PeriodOptions.Week:
        return chartData.map((d) => ({ ...d, tick: format(d.timeStamp, "dd.M")}));
  }
}

export default Chart;
