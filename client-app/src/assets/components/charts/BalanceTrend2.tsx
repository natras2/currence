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
    days?: 7 | 30 | 90;
}

export function BalanceTrend2({ transactions = [], totalBalance = 0, theme = 'light', days = 7 }: BalanceTrendProps) {
    const [gradient, setGradient] = useState<string | CanvasGradient>("rgba(53, 162, 235, 0.5)");
    const chartRef = useRef<any>(null);

    useEffect(() => {
        const chart = chartRef.current;

        if (chart) {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            
            if (chartArea) {
                // Crea un gradient che diventa trasparente verso il basso
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(53, 162, 235, 0.5)');
                gradient.addColorStop(0.7, 'rgba(53, 162, 235, 0.1)');
                gradient.addColorStop(1, 'rgba(53, 162, 235, 0)');
                setGradient(gradient);
            }
        }
    }, [theme, days]);

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
                backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                titleColor: theme === 'dark' ? '#fff' : '#333',
                bodyColor: theme === 'dark' ? '#ccc' : '#666',
                borderColor: theme === 'dark' ? '#555' : '#ddd',
                borderWidth: 1,
                padding: 16,
                displayColors: false,
                titleFont: {
                    size: 14,
                    weight: '600'
                },
                bodyFont: {
                    size: 16,
                    weight: '500'
                },
                bodySpacing: 6,
                callbacks: {
                    title: function(context: any) {
                        const dataIndex = context[0].dataIndex;
                        const date = dailyBalance[dataIndex].date;
                        return date.toLocaleDateString('it-IT', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                        });
                    },
                    label: function(context: any) {
                        return 'Bilancio: €' + context.parsed.y.toLocaleString('it-IT', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        });
                    },
                    afterLabel: function(context: any) {
                        const dataIndex = context.dataIndex;
                        const transactions = dailyBalance[dataIndex].transactions;
                        if (transactions.length > 0) {
                            return `\n${transactions.length} transazion${transactions.length === 1 ? 'e' : 'i'}`;
                        }
                        return '';
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
                hitRadius: 15,
                hoverRadius: 6,
                hoverBackgroundColor: 'rgb(53, 162, 235)',
                hoverBorderColor: '#fff',
                hoverBorderWidth: 3
            },
            line: {
                borderWidth: 3,
                cubicInterpolationMode: 'monotone'
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
                    autoSkip: true,
                    maxTicksLimit: days === 7 ? 7 : days === 30 ? 6 : 9
                }
            },
            y: {
                display: false
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        tension: 0,
        maintainAspectRatio: false
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