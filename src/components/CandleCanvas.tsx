import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { NormalizedCandle, CandleType } from "../types/upbitCandle";

type Props = {
  candles: NormalizedCandle[];
  candleType: CandleType;
  loading?: boolean;
};

const CandleCanvas = ({ candles, candleType, loading }: Props) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const { width, height } = ref.current.getBoundingClientRect();
    const margin = { top: 10, right: 90, bottom: 50, left: 10 };

    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#0e1621");

    const timeFormatMap: Record<CandleType, string> = {
      seconds: "%H:%M:%S",
      minutes: "%H:%M",
      days: "%m-%d",
      weeks: "%m-%d",
      months: "%Y-%m",
      years: "%Y",
    };
    const timeFormatter = d3.timeFormat(timeFormatMap[candleType]);

    const sortedCandles = [...candles].sort((a, b) => a.date.getTime() - b.date.getTime());
    const dates = sortedCandles.map((d) => d.date);
    const firstDate = dates[0] || new Date(Date.now() - 3600_000);
    const lastDate = dates[dates.length - 1] || new Date();

    const timeGap =
      dates.length > 1 ? dates[1].getTime() - dates[0].getTime() : 60_000;

    const x = d3
      .scaleTime()
      .domain([
        new Date(firstDate.getTime() - timeGap * 0.5),
        new Date(lastDate.getTime() + timeGap * 0.5),
      ])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(sortedCandles, (d) => d.low) ?? 0,
        d3.max(sortedCandles, (d) => d.high) ?? 100,
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x)
          .ticks(10)
          .tickFormat((d) => timeFormatter(d instanceof Date ? d : new Date(+d)))
      )
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("fill", "#ccc");

    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right}, 0)`)
      .call(
        d3.axisRight(y)
          .ticks(5)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(d3.format(","))
      )
      .call((g) => {
        g.selectAll(".tick line").attr("stroke", "#444").attr("stroke-dasharray", "2,2");
        g.selectAll(".tick text").attr("fill", "#ccc");
        g.select(".domain").remove();
      });

    if (!loading && sortedCandles.length > 0) {
      const candleWidth =
        dates.length > 1
          ? Math.max(3, (x(dates[1])! - x(dates[0])!) * 0.7)
          : 5;

      svg
        .append("g")
        .selectAll("g")
        .data(sortedCandles)
        .join("g")
        .attr("transform", (d) => `translate(${x(d.date)},0)`)
        .each(function (d) {
          const g = d3.select(this);
          const isUp = d.close > d.open;
          const color = isUp ? "#ff6b6b" : "#5dafff";
          const openY = y(d.open);
          const closeY = y(d.close);

          g.append("line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", y(d.high))
            .attr("y2", y(d.low))
            .attr("stroke", color)
            .attr("stroke-width", 1);

          g.append("rect")
            .attr("x", -candleWidth / 2)
            .attr("width", candleWidth)
            .attr("y", Math.min(openY, closeY))
            .attr("height", Math.max(1, Math.abs(closeY - openY)))
            .attr("fill", color);
        });
    }
  }, [candles, candleType, loading]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg
        ref={ref}
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          border: "1px solid #444",
        }}
      />
    </div>
  );
};

export default CandleCanvas;