export enum TransactionType {
    EXPENCE = "static.transactiontype.expence",
    INCOME = "static.transactiontype.income",
    TRANSFER = "static.transactiontype.transfer",
    MANAGEASSETS = "static.transactiontype.manageassets"
}

export type Category = {
    name: string;
    i18n_selector?: string;
}

export const defaultIncomeCategories: Category[] = [
    {
        name: "Salary",
        i18n_selector: "default.incomecategory.salary"
    },
    {
        name: "Business",
        i18n_selector: "default.incomecategory.business"
    },
    {
        name: "Investment",
        i18n_selector: "default.incomecategory.investment"
    },
    {
        name: "Freelance",
        i18n_selector: "default.incomecategory.freelance"
    },
    {
        name: "Rent",
        i18n_selector: "default.incomecategory.rent"
    },
    {
        name: "Dividend",
        i18n_selector: "default.incomecategory.dividend"
    },
    {
        name: "Interest",
        i18n_selector: "default.incomecategory.interest"
    },
    {
        name: "Bonus",
        i18n_selector: "default.incomecategory.bonus"
    },
    {
        name: "Scholarship",
        i18n_selector: "default.incomecategory.scholarship"
    },
    {
        name: "Refund",
        i18n_selector: "default.incomecategory.refund"
    },
    {
        name: "Gift",
        i18n_selector: "default.incomecategory.gift"
    },
    {
        name: "Benefit",
        i18n_selector: "default.incomecategory.benefit"
    },
    {
        name: "Credit management",
        i18n_selector: "default.incomecategory.creditmanagement"
    },
    {
        name: "Other",
        i18n_selector: "default.incomecategory.other"
    }
];


export const defaultExpenseCategories: Category[] = [
    {
        name: "Housing",
        i18n_selector: "default.expensecategory.housing"
    },
    {
        name: "Food & Drink",
        i18n_selector: "default.expensecategory.foodanddrink"
    },
    {
        name: "Transportation",
        i18n_selector: "default.expensecategory.transportation"
    },
    {
        name: "Insurance & Healthcare",
        i18n_selector: "default.expensecategory.insuranceandhealthcare"
    },
    {
        name: "Entertainment & Leisure",
        i18n_selector: "default.expensecategory.entertainmentandleisure"
    },
    {
        name: "Financial",
        i18n_selector: "default.expensecategory.financial"
    },
    {
        name: "Education",
        i18n_selector: "default.expensecategory.education"
    },
    {
        name: "Personal",
        i18n_selector: "default.expensecategory.personal"
    },
    {
        name: "Savings & Investments",
        i18n_selector: "default.expensecategory.savingsandinvestments"
    },
    {
        name: "Childcare & Family",
        i18n_selector: "default.expensecategory.childcareandfamily"
    },
    {
        name: "Professional",
        i18n_selector: "default.expensecategory.professional"
    },
    {
        name: "Travel & Vacations",
        i18n_selector: "default.expensecategory.travelandvacations"
    },
    {
        name: "Subscriptions & Memberships",
        i18n_selector: "default.expensecategory.subscriptionsandmemberships"
    },
    {
        name: "Gifts & Donations",
        i18n_selector: "default.expensecategory.giftsanddonations"
    },
    {
        name: "Debt Management",
        i18n_selector: "default.expensecategory.debtmanagement"
    },
    {
        name: "Other",
        i18n_selector: "default.expensecategory.other"
    }
];

export default class Transaction {
    id?: string;
    uid: string;
    date: Date;
    description: string;
    type: TransactionType;
    category: Category;
    amount: number;
    creationTime: number;
    fromAssetId?: string[];
    toAssetId?: string[];
    associatedPendingsId?: string[];

    constructor(uid: string, date = new Date(), description: string, type: TransactionType, category: Category, amount: number, fromAssetId?: string[], toAssetId?: string[], associatedPendingsId?: string[], creationTime: number = new Date().getTime()) {
        this.uid = uid;
        this.date = date;
        this.description = description;
        this.type = type;
        this.category = category;
        this.amount = amount;
        this.fromAssetId = fromAssetId;
        this.toAssetId = toAssetId;
        this.associatedPendingsId = associatedPendingsId
        this.creationTime = creationTime;
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
            category: transaction.category,
            amount: transaction.amount,
            fromAssetId: transaction.fromAssetId,
            toAssetId: transaction.toAssetId,
            associatedPendingsId: transaction.associatedPendingsId,
            creationTime: transaction.creationTime
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        const transaction = new Transaction(data.uid, data.date, data.description, data.type, data.category, data.amount, data.fromAssetId, data.toAssetId, data.associatedPendingsId, data.creationTime);
        transaction.id = snapshot.id;
        return transaction;
    }
};