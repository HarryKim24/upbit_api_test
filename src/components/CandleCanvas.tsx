import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { NormalizedCandle, CandleType } from "../types/upbitCandle";

type Props = {
  candles: NormalizedCandle[];
  candleType: CandleType;
};

const CandleCanvas = ({ candles, candleType }: Props) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!candles.length || !ref.current) return;

    const sortedCandles = [...candles].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 50, bottom: 30, left: 60 };

    const timeFormatMap: Record<CandleType, string> = {
      seconds: "%H:%M:%S",
      minutes: "%H:%M",
      days: "%m-%d",
      weeks: "%m-%d",
      months: "%Y-%m",
      years: "%Y",
    };
    const timeFormatter = d3.timeFormat(timeFormatMap[candleType]);

    const x = d3
      .scaleBand()
      .domain(sortedCandles.map((d) => d.date.toISOString()))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const candleWidth = x.bandwidth();

    const minPrice = d3.min(sortedCandles, (d) => d.low)!;
    const maxPrice = d3.max(sortedCandles, (d) => d.high)!;

    const y = d3
      .scaleLinear()
      .domain([minPrice, maxPrice])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(
            x.domain().filter((_, i) => i % Math.ceil(sortedCandles.length / 10) === 0)
          )
          .tickFormat((d) => timeFormatter(new Date(d)))
      )
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .append("g")
      .selectAll("g")
      .data(sortedCandles)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.date.toISOString())},0)`)
      .each(function (d) {
        const g = d3.select(this);
        const color = d.close > d.open ? "#4caf50" : "#f44336";

        const openY = y(d.open);
        const closeY = y(d.close);

        g.append("line")
          .attr("x1", candleWidth / 2)
          .attr("x2", candleWidth / 2)
          .attr("y1", y(d.high))
          .attr("y2", y(d.low))
          .attr("stroke", color)
          .attr("stroke-width", 1);

        g.append("rect")
          .attr("x", 0)
          .attr("width", candleWidth)
          .attr("y", Math.min(openY, closeY))
          .attr("height", Math.max(1, Math.abs(closeY - openY)))
          .attr("fill", color);
      });
  }, [candles, candleType]);

  return (
    <svg
      ref={ref}
      width="100%"
      height="600px"
      viewBox="0 0 800 600"
      style={{ border: "1px solid #ccc", background: "#fff" }}
    />
  );
};

export default CandleCanvas;
