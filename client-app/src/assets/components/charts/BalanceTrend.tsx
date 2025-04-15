import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    scales,
    elements,
    PointStyle
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useContext, useEffect, useRef, useState } from 'react';
import { ThemeContext } from '../../../App';



export function BalanceTrend() {
    const [gradient, setGradient] = useState("rgba(53, 162, 235, 0.5)");
    const chartRef = useRef<any>();
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const chart = chartRef.current;

        if (chart) {
            var ctx = chart.ctx;

            var gradient = ctx.createLinearGradient(0, 0, 0, 180);
            gradient.addColorStop(0, 'rgba(53, 162, 235, 1)');
            gradient.addColorStop(1, (theme === "dark") ? 'rgba(51, 51, 51, .2)' : 'rgba(241, 243, 246, .2)');

            setGradient(gradient);
        }

    }, []);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Filler
    );

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false,
                text: 'Balance Trend',
            },
            tooltip: { 
                enabled: false 
            },
        },
        elements: {
            point: {
                pointStyle: false as PointStyle
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        },
        tension: 0.3,
        maintainAspectRatio: false
    };

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                data: [470, 270, 890, 430, 500, 760, 340],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: gradient
            },
        ],
    };
    return <Line ref={chartRef} options={options} data={data} />;
}
