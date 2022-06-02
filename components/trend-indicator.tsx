import styles from "../styles/Icon.module.css";

interface TrendIndicatorProps {
  ratio: number;
}

function TrendIndicator({ ratio }: TrendIndicatorProps) {
  const color =
    ratio === 1
      ? "text-gray-500"
      : ratio > 1
      ? "text-orange-500"
      : "text-blue-500";
  ratio = ratio > 2 ? 2 : ratio;
  ratio = ratio < 0 ? 0 : ratio;

  const fixedRatio =
    ratio === 1 ? ratio : ratio > 1 ? 1 - (ratio - 1) : 1 - ratio + 1;

  const angle = fixedRatio * 90;

  return (
    <div className={color}>
      <i
        className={styles.arrowUpO}
        style={{ transform: `rotate(${angle}deg)` }}
      />
    </div>
  );
}

export default TrendIndicator;
