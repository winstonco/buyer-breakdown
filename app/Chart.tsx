import {
  Chart,
  Title,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { SetBreakdown } from "@/lib/scryfall";

Chart.register(
  Title,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement
);

export default function MyChart({ data }: { data: SetBreakdown }) {
  const chartData: {
    labels: string[];
    datasets: { label: string; data: number[] }[];
  } = {
    labels: [] as string[],
    datasets: [
      {
        label: "No reprints",
        data: [],
      },
      {
        label: "All printings",
        data: [],
      },
    ],
  };
  const extraData: {
    cards: string[][];
  } = {
    cards: [],
  };
  for (const [setName, setData] of Object.entries(data)) {
    chartData.labels.push(setName);
    chartData.datasets[0].data.push(setData.ogPrints);
    chartData.datasets[1].data.push(setData.ogPrints + setData.reprints);
    extraData.cards.push(Array.from(setData.cards));
  }

  return (
    <div>
      <Bar
        data={chartData}
        width={500}
        height={500}
        options={{
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                afterBody: (context) => {
                  console.log(context);
                  return (
                    extraData.cards[context[0].dataIndex] as string[]
                  ).join("\n");
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
