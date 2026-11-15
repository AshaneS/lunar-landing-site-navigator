"use client";

import {
  Area,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceDot,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "../ui/spinner";

export type HorizonData = {
  azimuth: number;
  elevation: number;
};

const chartConfig = {
  desktop: {
    label: "Terrain",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function LocalHorizonProfile({
  data,
  sunPos,
  earthPos,
  isLoading,
}: {
  data: HorizonData[];
  sunPos?: { azimuth: number; elevation: number };
  earthPos?: { azimuth: number; elevation: number };
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Horizon</CardTitle>
        <CardDescription>Azimuth vs Elevation (°)</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-75 w-full items-center justify-center">
            <Empty className="w-full border-none">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Spinner />
                </EmptyMedia>
                <EmptyTitle>Calculating Horizon...</EmptyTitle>
                <EmptyDescription>
                  Analyzing lunar terrain data for this coordinate.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-75 w-full"
          >
            <ComposedChart
              accessibilityLayer
              data={data}
              // Added top margin so the labels don't get cut off
              margin={{ left: 0, right: 12, top: 24, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.5}
              />

              <XAxis
                dataKey="azimuth"
                domain={[0, 360]}
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}°`}
              />

              <YAxis
                type="number"
                domain={[-10, 10]}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />

              {/* Subtle Horizon Line */}
              <ReferenceLine
                y={0}
                stroke="currentColor"
                strokeOpacity={0.3}
                strokeDasharray="3 3"
              />

              <ChartTooltip
                cursor={{ stroke: "currentColor", strokeOpacity: 0.1 }}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />

              {/* Terrain Area */}
              <Area
                dataKey="elevation"
                type="linear" // "step" looks like mountains. "linear" looks like a smooth blob.
                fill="var(--color-desktop)"
                fillOpacity={0.2}
                stroke="var(--color-desktop)"
                strokeWidth={2}
                baseValue={-15} // IMPORTANT: Fills down to the bottom of the Y-axis
              />

              {/* The Sun Dot */}
              {sunPos && (
                <ReferenceDot
                  x={sunPos.azimuth}
                  y={sunPos.elevation}
                  r={8}
                  fill="#eab308" // Tailwind yellow-500
                  stroke="#ffffff" // White border makes it pop
                  strokeWidth={2}
                  // isFront={true}
                  label={{
                    value: "Sun",
                    position: "top",
                    fill: "#eab308",
                    fontSize: 11,
                    fontWeight: "bold",
                  }}
                />
              )}

              {/* The Earth Dot */}
              {earthPos && (
                <ReferenceDot
                  x={earthPos.azimuth}
                  y={earthPos.elevation}
                  r={8}
                  fill="#3b82f6" // Tailwind blue-500
                  stroke="#ffffff" // White border makes it pop
                  strokeWidth={2}
                  isFront={true}
                  label={{
                    value: "Earth",
                    position: "top",
                    fill: "#3b82f6",
                    fontSize: 11,
                    fontWeight: "bold",
                  }}
                />
              )}
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
