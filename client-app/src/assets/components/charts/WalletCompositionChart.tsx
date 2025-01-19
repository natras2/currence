import { PieChart } from "@mui/x-charts"
import { ChartData } from "../../../app/PersonalArea/Stats"

export default function WalletCompositionChart(data: ChartData[]) {
    return (
        <PieChart
            series={[
                {
                    data: data,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 1,
                    cornerRadius: 5,
                    startAngle: -90,
                    endAngle: 90,
                    cx: 150,
                    cy: 150,
                }
            ]}
        />
    )
}