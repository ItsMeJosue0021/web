import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { _get } from "../../api";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const GCashDonationChart = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async (selectedYear) => {
    try {
      setLoading(true);
      const response = await _get(`/gcash-donations/stats?year=${selectedYear}`);

      const { data } = response.data;

      const labels = data.map((d) => d.month);
      const totals = data.map((d) => d.total);

      setChartData({
        labels,
        datasets: [
          {
            label: `Number of Donations (${selectedYear})`,
            data: totals,
            backgroundColor: "rgba(22, 163, 74, 0.6)",
            borderColor: "rgba(22, 163, 74, 1)",
            borderRadius: 5,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(year);
  }, [year]);

  return (
    <div className="h-auto w-full md:min-h-72 bg-white p-2">
        <div className="h-full w-full flex items-center justify-start gap-4">
            <p className="text-xs">Filter by year</p>
            <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="text-xs px-4 py-1.5 rounded-md border border-gray-300">
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>
                {y}
                </option>
            ))}
            </select>
        </div>

        {loading ? (
            <p className="text-xs h-full w-full flex items-center justify-center">Loading chart...</p>
        ) : (
            <Bar
            data={chartData}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                    },
                },
            }}
            />
        )}
    </div>
  );
};

export default GCashDonationChart;
