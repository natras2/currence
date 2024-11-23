export enum TransactionType {
    EXPENCE = "static.transactiontype.expence",
    INCOME = "static.transactiontype.income",
    TRANSFER = "static.transactiontype.transfer",
    MANAGEASSETS = "static.transactiontype.manageassets"
}

export const defaultIncomeCategories = [
    "Salary",
    "Business",
    "Investment",
    "Freelance",
    "Rent",
    "Dividend",
    "Interest",
    "Bonus",
    "Scholarship",
    "Refund",
    "Credit management",
    "Gift",
    "Benefit",
    "Other"
];

export const defaultExpenseCategories = [
    "Housing",
    "Food & Drink",
    "Transportation",
    "Insurance & Healthcare",
    "Entertainment & Leisure",
    "Financial",
    "Education",
    "Personal",
    "Savings & Investments",
    "Childcare & Family",
    "Professional",
    "Travel & Vacations",
    "Subscriptions & Memberships",
    "Gifts & Donations",
    "Debt Management",
    "Other"
];

export default class Transaction {
    uid: string;
    date: Date;
    description: string;
    type: TransactionType;
    category: string;


    constructor(uid: string, date = new Date(), description: string, type: TransactionType, category: string) {
        this.uid = uid;
        this.date = date;
        this.description = description;
        this.type = type;
        this.category = category;
    }
}
