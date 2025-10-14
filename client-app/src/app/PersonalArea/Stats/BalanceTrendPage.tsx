import { useContext, useState } from "react";
import { PersonalAreaContext, PersonalAreaContextInterface } from "../../PersonalArea";
import Asset from "../../../assets/model/Asset";
import { ChartData } from "../Stats";
import User from "../../../assets/model/User";
import { ThemeContext, TranslationContext } from "../../../App";
import { BackButton } from "../../../assets/components/Utils";
import { BalanceTrend } from "../../../assets/components/charts/BalanceTrend";

export default function BalanceTrendPage() {
    const { data, controllers } = useContext<PersonalAreaContextInterface>(PersonalAreaContext);
    const i18t = useContext(TranslationContext);

    const user: User = data.user;
    const assets: Asset[] = data.assets;

    const theme = useContext(ThemeContext);
    const [selectedDays, setSelectedDays] = useState<8 | 30 | 90>(8);

    // Nei pulsanti

    // the chart doesn't show assets that have a balance lower than 2% of the total 
    const filteredAssets = assets.filter((asset) => asset.balance / user.totalBalance > 0.02);
    const chartData = filteredAssets.map((asset, i) => {
        return {
            id: i,
            label: asset.name,
            value: asset.balance
        } as ChartData
    }) as ChartData[];

    // assets with a balance lower than 2% are aggregated in the "other" element
    var otherValue = 0
    const otherAssets = assets.filter((asset) => asset.balance / user.totalBalance <= 0.02);
    otherAssets.forEach((asset) => {
        otherValue += asset.balance
    })
    chartData.push({
        id: chartData.length,
        label: i18t.t("static.assetType.other"),
        value: otherValue
    })

    return <>
        <div id="stats-wallet-composition" className="callout page">
            <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <BackButton close link=".." />
                    <div className="page-title" style={{ marginTop: 1 }}>Balance trend</div>
                    <div style={{ width: "31px" }}></div>
                </div>
                <div className="body" style={{ height: 500 }} >

                    <button onClick={() => setSelectedDays(8)}>8 giorni</button>
                    <button onClick={() => setSelectedDays(30)}>30 giorni</button>
                    <button onClick={() => setSelectedDays(90)}>90 giorni</button>

                    <BalanceTrend
                        transactions={data.transactions}
                        totalBalance={user.totalBalance}
                        theme={theme}
                        days={selectedDays}
                    />
                    {/*<PieChart
                        colors={cheerfulFiestaPaletteDark}
                        series={[
                            {
                                data: chartData,
                                innerRadius: 30,
                                outerRadius: 100,
                                paddingAngle: 1,
                                cornerRadius: 5,
                                startAngle: -90,
                                endAngle: 90,
                                cx: 150,
                                cy: 150,
                                arcLabelMinAngle: 75,
                                valueFormatter: (value) => {
                                    return currencyFormat(value.value)
                                }
                            }
                        ]}
                        sx={{
                            [`& .${pieArcClasses.root}`]: {
                                stroke: 'none',
                                transform: "scale(1.3)"
                            },
                        }}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: { vertical: 'middle', horizontal: 'middle' },
                                padding: 0,
                                itemMarkWidth: 20,
                                itemMarkHeight: 4,
                                markGap: 5,
                                itemGap: 10,
                                labelStyle: { fontSize: 14, fill: (theme === "light") ? 'blue' : 'white' }
                            },
                        }}

                    />*/}
                </div>
            </div>
        </div>
    </>;
}