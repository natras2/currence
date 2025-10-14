import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useRef, useState } from 'react';
import Transaction from '../../model/Transaction';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
);

interface DailyBalanceData {
    date: Date;
    balance: number;
    transactions: Transaction[];
}

interface BalanceTrendProps {
    transactions?: Transaction[];
    totalBalance?: number;
    theme?: 'light' | 'dark' | string;
    days?: 8 | 30 | 90;
}

export function BalanceTrend({ transactions = [], totalBalance = 0, theme = 'light', days = 8 }: BalanceTrendProps) {
    const [gradient, setGradient] = useState<string | CanvasGradient>("rgba(53, 162, 235, 0.5)");
    const chartRef = useRef<any>(null);

    useEffect(() => {
        const chart = chartRef.current;

        if (chart) {
            const ctx = chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 180);
            gradient.addColorStop(0, 'rgba(53, 162, 235, 1)');
            gradient.addColorStop(1, (theme === "dark") ? 'rgba(51, 51, 51, .2)' : 'rgba(241, 243, 246, .2)');
            setGradient(gradient);
        }
    }, [theme]);

    // Funzione per convertire Timestamp Firestore in Date
    const convertToDate = (date: any): Date => {
        if (!date) return new Date();

        // Se è già una Date
        if (date instanceof Date) return date;

        // Se è un Timestamp Firestore
        if (date.toDate && typeof date.toDate === 'function') {
            return date.toDate();
        }

        // Se è un oggetto con seconds (formato Firestore serializzato)
        if (date.seconds) {
            return new Date(date.seconds * 1000);
        }

        // Prova a convertirlo come stringa
        return new Date(date);
    };

    // Funzione per normalizzare la data alla mezzanotte locale
    const normalizeDate = (date: Date): Date => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    };

    // Funzione per ottenere la chiave della data in formato locale
    const getLocalDateKey = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Funzione per calcolare il bilancio giornaliero
    const calculateDailyBalance = (): DailyBalanceData[] => {
        const today = normalizeDate(new Date());
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - days);

        console.log('Total balance:', totalBalance);
        console.log('Total transactions:', transactions.length);
        console.log('Date range:', startDate, 'to', today, `(${days} days)`);

        // Filtra transazioni del periodo selezionato
        const recentTransactions: Transaction[] = transactions.filter((t: Transaction) => {
            const transactionDate = normalizeDate(convertToDate(t.date));
            const isInRange = transactionDate >= startDate && transactionDate <= today;
            return isInRange;
        });

        console.log(`Recent transactions (last ${days} days):`, recentTransactions.length);

        // Ordina per data
        recentTransactions.sort((a: Transaction, b: Transaction) => {
            const dateA = convertToDate(a.date);
            const dateB = convertToDate(b.date);
            return dateA.getTime() - dateB.getTime();
        });

        // Crea un array con tutti i giorni del periodo
        const dailyData: DailyBalanceData[] = [];
        const dateMap = new Map<string, DailyBalanceData>();

        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateKey = getLocalDateKey(date);
            const dayData: DailyBalanceData = { date, balance: 0, transactions: [] };
            dateMap.set(dateKey, dayData);
            dailyData.push(dayData);
        }

        // Aggrega le transazioni per giorno
        recentTransactions.forEach((transaction: Transaction) => {
            const transactionDate = normalizeDate(convertToDate(transaction.date));
            const dateKey = getLocalDateKey(transactionDate);

            if (dateMap.has(dateKey)) {
                dateMap.get(dateKey)!.transactions.push(transaction);
            }
        });

        // Calcola il bilancio progressivo partendo dal bilancio corrente e andando indietro
        let currentBalance: number = totalBalance;

        // Prima calcola il totale delle transazioni del periodo
        let totalChange: number = 0;
        recentTransactions.forEach((transaction: Transaction) => {
            const type = transaction.type;
            if (type === "static.transactiontype.income") {
                totalChange += transaction.amount;
            } else if (type === "static.transactiontype.expence") {
                totalChange -= transaction.amount;
            }
        });

        console.log(`Total change in last ${days} days:`, totalChange);

        // Il bilancio all'inizio del periodo era il bilancio attuale meno le variazioni
        let runningBalance: number = currentBalance - totalChange;

        console.log(`Starting balance (${days} days ago):`, runningBalance);

        // Ora calcola giorno per giorno andando avanti
        dailyData.forEach((day: DailyBalanceData, index: number) => {
            const dayTransactions = day.transactions;

            dayTransactions.forEach((transaction: Transaction) => {
                const type = transaction.type;
                if (type === "static.transactiontype.income") {
                    runningBalance += transaction.amount;
                } else if (type === "static.transactiontype.expence") {
                    runningBalance -= transaction.amount;
                }
            });

            day.balance = runningBalance;

            if (dayTransactions.length > 0) {
                console.log(`Day ${index}: ${getLocalDateKey(day.date)}, transactions: ${dayTransactions.length}, balance: ${day.balance}`);
            }
        });

        return dailyData;
    };

    const dailyBalance: DailyBalanceData[] = calculateDailyBalance();

    const labels: string[] = dailyBalance.map((day: DailyBalanceData) => {
        const date = new Date(day.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const balanceData: number[] = dailyBalance.map((day: DailyBalanceData) => day.balance);

    const options: any = {
        responsive: true,
        plugins: {
            title: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: theme === 'dark' ? 'rgba(51, 51, 51, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: theme === 'dark' ? '#fff' : '#333',
                bodyColor: theme === 'dark' ? '#fff' : '#333',
                borderColor: theme === 'dark' ? '#555' : '#ddd',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function (context: any) {
                        return '€ ' + context.parsed.y.toLocaleString('it-IT', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                    }
                }
            },
            legend: {
                display: false
            }
        },
        elements: {
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 5,
                hoverBackgroundColor: 'rgb(53, 162, 235)',
                hoverBorderColor: '#fff',
                hoverBorderWidth: 2
            },
            line: {
                borderWidth: 2
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: theme === 'dark' ? '#999' : '#666',
                    font: {
                        size: 10
                    },
                    maxRotation: 0,
                    autoSkip: !(days === 8),
                    callback: !(days === 8) ? undefined : function (this: any, value: any, index: number) {
                        // Mostra solo le label a partire dall'indice 1, poi ogni 2
                        if (index === 0) return '';
                        if ((index - 1) % 2 === 0) return this.getLabelForValue(value);
                        return '';
                    },
                    maxTicksLimit: days === 8 ? 8 : days === 30 ? 6 : 9
                }
            },
            y: {
                display: false,
                grid: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: theme === 'dark' ? '#999' : '#666',
                    font: {
                        size: 10
                    },
                    callback: function (value: any) {
                        return '€ ' + value.toLocaleString('it-IT', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        });
                    },
                    maxTicksLimit: 5
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        maintainAspectRatio: false,
        cubicInterpolationMode: 'monotone',
        tension: 1
    };

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                data: balanceData,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: gradient
            },
        ],
    };

    return <Line ref={chartRef} options={options} data={data} />;
}