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

    // ✅ 날짜 오름차순 정렬 (과거 → 현재)
    const sortedCandles = [...candles].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    // ✅ 가장 최신 날짜 로그 확인
    console.log("📅 최신 날짜:", sortedCandles[sortedCandles.length - 1].date.toISOString());

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // 초기화

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 50, bottom: 30, left: 60 };

    // 시간 포맷
    const timeFormatMap: Record<CandleType, string> = {
      seconds: "%H:%M:%S",
      minutes: "%H:%M",
      days: "%m-%d",
      weeks: "%m-%d",
      months: "%Y-%m",
      years: "%Y",
    };
    const timeFormatter = d3.timeFormat(timeFormatMap[candleType]);

    // ✅ X축 - 정렬된 배열 기반 도메인
    const x = d3
      .scaleBand()
      .domain(sortedCandles.map((d) => d.date.toISOString()))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const candleWidth = x.bandwidth();

    // ✅ Y축 - domain(min → max), range(bottom → top)
    const minPrice = d3.min(sortedCandles, (d) => d.low)!;
    const maxPrice = d3.max(sortedCandles, (d) => d.high)!;

    const y = d3
      .scaleLinear()
      .domain([minPrice, maxPrice])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // X축 그리기
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

    // Y축 그리기
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // 캔들 그리기
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

        // Wick
        g.append("line")
          .attr("x1", candleWidth / 2)
          .attr("x2", candleWidth / 2)
          .attr("y1", y(d.high))
          .attr("y2", y(d.low))
          .attr("stroke", color)
          .attr("stroke-width", 1);

        // Body
        g.append("rect")
          .attr("x", 0)
          .attr("width", candleWidth)
          .attr("y", Math.min(openY, closeY)) // 위쪽에서 시작
          .attr("height", Math.max(1, Math.abs(closeY - openY))) // 아래로 내려감
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
