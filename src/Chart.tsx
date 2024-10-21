import { onMount } from "solid-js";
import type { Component } from "solid-js";
import { Chart, Title, Tooltip, Legend, Colors } from "chart.js";
import type { ChartOptions } from "chart.js";
import { DefaultChart } from "solid-chartjs";
import type { SetBreakdown } from "./data";

const MyChart: Component<{ data: SetBreakdown }> = ({ data }) => {
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const setData: {
    labels: string[];
    datasets: { label: string; data: any[] }[];
  } = {
    labels: [],
    datasets: [
      {
        label: "No reprints",
        data: [],
      },
      {
        label: "All reprints",
        data: [],
      },
      {
        label: "Cards",
        data: [],
      },
    ],
  };
  for (const [cardName, setList] of Object.entries(data)) {
    for (const [setName, numPrints] of Object.entries(setList)) {
      const idx = setData.labels.indexOf(setName);
      if (idx === -1) {
        setData.labels.push(setName);
        setData.datasets[0].data.push(1);
        setData.datasets[1].data.push(numPrints);
        setData.datasets[2].data.push([cardName]);
        continue;
      }

      setData.datasets[0].data[idx]++;
      setData.datasets[1].data[idx] += numPrints;
      setData.datasets[2].data[idx].push(cardName);
    }
  }

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        // stacked: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          afterBody: (context) => {
            return setData.datasets[2].data[context[0].dataIndex];
          },
        },
      },
    },
  };

  return (
    <div>
      <DefaultChart
        type="bar"
        data={setData}
        options={chartOptions}
        width={500}
        height={500}
      />
    </div>
  );
};

export default MyChart;
