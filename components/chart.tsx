import { subHours } from "date-fns";
import subDays from "date-fns/subDays";
import { ReactElement, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";
import { DateFormat } from "../utils/date";
import RoundButton from "./round-button";

export type DataPointKey =
  | "temperature"
  | "humidity"
  | "pressure"
  | "temperatureExt"
  | "humidityExt"
  | "pressureExt";

interface TimeStamped {
  timeStamp: Date;
}

export type ChartData = TimeStamped & Record<DataPointKey, number>;

interface ChartProps {
  chartData: ChartData[];
  location: string;
  dataKey: DataPointKey;
  showLegend?: boolean;
  unit?: string;
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

function Chart({ chartData, location, dataKey, showLegend, unit }: ChartProps) {
  const [periodState, setPeriodState] = useState<PeriodState>({
    selectedPeriod: PeriodOptions.SixHours,
    dataSet: GetDataSet(PeriodOptions.SixHours, chartData),
  });

  useEffect(() => {
    const dataSet = GetDataSet(periodState.selectedPeriod, chartData);
    setPeriodState((prevState) => ({
      ...prevState,
      dataSet,
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
          <XAxis dataKey="tick" angle={45} height={100} tickMargin={25} />
          <YAxis tickCount={9} domain={["auto", "auto"]} unit={unit} />
          {showLegend && <Legend />}
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface RechartsTooltipPayload {
  chartType: string | undefined;
  color: string;
  dataKey: DataPointKey;
  fill: string;
  formatter: string | undefined;
  name: string;
  payload: ChartDataWithTicks;
  points: [];
  stroke: string;
  strokeWidth: number;
  type: string | undefined;
  unit: string | undefined;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: RechartsTooltipPayload[];
  label?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label: _,
}: CustomTooltipProps): ReactElement | null => {
  if (active && payload && payload?.length > 0) {
    console.log({ payload });
    return (
      <div className="p-4 text-sm bg-white border rounded opacity-70">
        <p className="mb-4">{DateFormat(payload[0].payload.timeStamp)}</p>
        {payload.map((p: RechartsTooltipPayload, idx: number) => (
          <div key={idx} className="flex flex-row gap-4">
            <span className="flex-auto">{p.name}</span>
            <span className="flex-initial font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

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

function GetDataSet(
  selectedPeriod: PeriodOptions,
  chartData: ChartData[]
): ChartDataWithTicks[] {
  const dataSet = FilterDataSet(selectedPeriod, chartData);
  switch (selectedPeriod) {
    case PeriodOptions.SixHours:
    case PeriodOptions.Day:
      return dataSet.map((d) => ({
        ...d,
        tick: DateFormat(d.timeStamp, "HH:mm"),
      }));
    case PeriodOptions.ThreeDays:
    case PeriodOptions.Week:
      return dataSet.map((d) => ({
        ...d,
        tick: DateFormat(d.timeStamp, "dd.M"),
      }));
  }
}

export default Chart;
