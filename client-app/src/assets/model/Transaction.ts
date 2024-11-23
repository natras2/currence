export enum TransactionType {
    EXPENCE = "static.transactiontype.expence",
    INCOME = "static.transactiontype.income",
    TRANSFER = "static.transactiontype.transfer",
    MANAGEASSETS = "static.transactiontype.manageassets"
}

export const defaultIncomeCategories = {
    "Salary": "default.incomecategory.salary",
    "Business": "default.incomecategory.business",
    "Investment": "default.incomecategory.investment",
    "Freelance": "default.incomecategory.freelance",
    "Rent": "default.incomecategory.rent",
    "Dividend": "default.incomecategory.dividend",
    "Interest": "default.incomecategory.interest",
    "Bonus": "default.incomecategory.bonus",
    "Scholarship": "default.incomecategory.scholarship",
    "Refund": "default.incomecategory.refund",
    "Gift": "default.incomecategory.gift",
    "Benefit": "default.incomecategory.benefit",
    "Credit management": "default.incomecategory.creditmanagement",
    "Other": "default.incomecategory.other"
};

export const defaultExpenseCategories = {
    "Housing": "default.expensecategory.housing",
    "Food & Drink": "default.expensecategory.foodanddrink",
    "Transportation": "default.expensecategory.transportation",
    "Insurance & Healthcare": "default.expensecategory.insuranceandhealthcare",
    "Entertainment & Leisure": "default.expensecategory.entertainmentandleisure",
    "Financial": "default.expensecategory.financial",
    "Education": "default.expensecategory.education",
    "Personal": "default.expensecategory.personal",
    "Savings & Investments": "default.expensecategory.savingsandinvestments",
    "Childcare & Family": "default.expensecategory.childcareandfamily",
    "Professional": "default.expensecategory.professional",
    "Travel & Vacations": "default.expensecategory.travelandvacations",
    "Subscriptions & Memberships": "default.expensecategory.subscriptionsandmemberships",
    "Gifts & Donations": "default.expensecategory.giftsanddonations",
    "Debt Management": "default.expensecategory.debtmanagement",
    "Other": "default.expensecategory.other"
};


export default class Transaction {
    id?: string;
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

// Firestore data converter
export const transactionConverter = {
    toFirestore: (transaction: Transaction) => {
        return {
            uid: transaction.uid,
            date: transaction.date,
            description: transaction.description,
            type: transaction.type,
            category: transaction.category
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        const transaction = new Transaction(data.uid, data.date, data.description, data.type, data.category);
        transaction.id = snapshot.id;
        return transaction;
    }
};