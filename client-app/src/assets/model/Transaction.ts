export enum TransactionType {
    EXPENCE = "static.transactiontype.expence",
    INCOME = "static.transactiontype.income",
    TRANSFER = "static.transactiontype.transfer",
    MANAGEASSETS = "static.transactiontype.manageassets"
}

export interface AssetAllocation {
    assetId: string;
    amount: number;
}

export interface Category {
    name: string;
    i18n_selector?: string;
    icon?: string;
    subcategories: Category[] | null
}

export const defaultIncomeCategories: Category[] = [
    {
        name: "Salary & bonuses",
        i18n_selector: "default.incomecategory.salary.name",
        icon: JSON.stringify({ lib: "io", name: "IoIosCash" }),
        subcategories: [
            {
                name: "Wage",
                i18n_selector: "default.incomecategory.salary.sub.wage",
                subcategories: null
            },
            {
                name: "Pension",
                i18n_selector: "default.incomecategory.salary.sub.pension",
                subcategories: null
            },
            {
                name: "Self-Employment earnings",
                i18n_selector: "default.incomecategory.salary.sub.freelance",
                subcategories: null
            }
        ]
    },
    {
        name: "Investments & dividends",
        i18n_selector: "default.incomecategory.investments.name",
        icon: JSON.stringify({ lib: "md", name: "MdTrendingUp" }),
        subcategories: [
            {
                name: "Stock dividends",
                i18n_selector: "default.incomecategory.investments.sub.stockdividends",
                subcategories: null
            },
            {
                name: "Interest from savings",
                i18n_selector: "default.incomecategory.investments.sub.savingsinterest",
                subcategories: null
            },
            {
                name: "Real Estate income",
                i18n_selector: "default.incomecategory.investments.sub.realestate",
                subcategories: null
            }
        ]
    },
    {
        name: "Sales & Business",
        i18n_selector: "default.incomecategory.business.name",
        icon: JSON.stringify({ lib: "bi", name: "BiBriefcase" }),
        subcategories: [
            {
                name: "Sales",
                i18n_selector: "default.incomecategory.business.sub.sales",
                subcategories: null
            },
            {
                name: "Consulting",
                i18n_selector: "default.incomecategory.business.sub.consulting",
                subcategories: null
            }
        ]
    },
    {
        name: "Social benefits",
        i18n_selector: "default.incomecategory.government.name",
        icon: JSON.stringify({ lib: "gi", name: "GiReceiveMoney" }),
        subcategories: [
            {
                name: "Unemployment benefits",
                i18n_selector: "default.incomecategory.government.sub.unemployment",
                subcategories: null
            }
        ]
    },
    {
        name: "Gifts & Donations",
        i18n_selector: "default.incomecategory.gifts.name",
        icon: JSON.stringify({ lib: "fa", name: "FaHandHoldingHeart" }),
        subcategories: null
    },
    {
        name: "Other incomes",
        i18n_selector: "default.incomecategory.other.name",
        icon: JSON.stringify({ lib: "md", name: "MdMoreHoriz" }),
        subcategories: null
    }
];


export const defaultExpenseCategories: Category[] = [
    {
        name: "Housing & utilities",
        i18n_selector: "default.outcomecategory.housing.name",
        icon: JSON.stringify({ lib: "fa", name: "FaHome" }),
        subcategories: [
            {
                name: "Rent",
                i18n_selector: "default.outcomecategory.housing.sub.rent",
                subcategories: null
            },
            {
                name: "Mortgage",
                i18n_selector: "default.outcomecategory.housing.sub.mortgage",
                subcategories: null
            },
            {
                name: "Internet & Phone",
                i18n_selector: "default.outcomecategory.housing.sub.internetphone",
                subcategories: null
            }
        ]
    },
    {
        name: "Food & groceries",
        i18n_selector: "default.outcomecategory.food.name",
        icon: JSON.stringify({ lib: "md", name: "MdRestaurant" }),
        subcategories: [
            {
                name: "Supermarket",
                i18n_selector: "default.outcomecategory.food.sub.supermarket",
                subcategories: null
            },
            {
                name: "Restaurants",
                i18n_selector: "default.outcomecategory.food.sub.restaurants",
                subcategories: null
            },
            {
                name: "Takeaway & Delivery",
                i18n_selector: "default.outcomecategory.food.sub.takeawaydelivery",
                subcategories: null
            }
        ]
    },
    {
        name: "Transportation",
        i18n_selector: "default.outcomecategory.transportation.name",
        icon: JSON.stringify({ lib: "fa", name: "FaCar" }),
        subcategories: [
            {
                name: "Fuel",
                i18n_selector: "default.outcomecategory.transportation.sub.fuel",
                subcategories: null
            },
            {
                name: "Public transport",
                i18n_selector: "default.outcomecategory.transportation.sub.publictransport",
                subcategories: null
            },
            {
                name: "Car maintenance",
                i18n_selector: "default.outcomecategory.transportation.sub.maintenance",
                subcategories: null
            },
            {
                name: "Car and bike share",
                i18n_selector: "default.outcomecategory.transportation.sub.bikeshare",
                subcategories: null
            }
        ]
    },
    {
        name: "Health & insurance",
        i18n_selector: "default.outcomecategory.health.name",
        icon: JSON.stringify({ lib: "md", name: "MdLocalHospital" }),
        subcategories: [
            {
                name: "Health Insurance",
                i18n_selector: "default.outcomecategory.health.sub.insurance",
                subcategories: null
            },
            {
                name: "Doctor visits",
                i18n_selector: "default.outcomecategory.health.sub.doctorvisits",
                subcategories: null
            },
            {
                name: "Medications",
                i18n_selector: "default.outcomecategory.health.sub.medications",
                subcategories: null
            },
            {
                name: "Gym & fitness",
                i18n_selector: "default.outcomecategory.health.sub.gymfitness",
                subcategories: null
            }
        ]
    },
    {
        name: "Entertainment & leisure",
        i18n_selector: "default.outcomecategory.entertainment.name",
        icon: JSON.stringify({ lib: "md", name: "MdTheaters" }),
        subcategories: [
            {
                name: "Subscriptions",
                i18n_selector: "default.outcomecategory.entertainment.sub.subscriptions",
                subcategories: null
            },
            {
                name: "Cinema",
                i18n_selector: "default.outcomecategory.entertainment.sub.cinema",
                subcategories: null
            },
            {
                name: "Books",
                i18n_selector: "default.outcomecategory.entertainment.sub.books",
                subcategories: null
            },
            {
                name: "Games and hobbies",
                i18n_selector: "default.outcomecategory.entertainment.sub.hobbies",
                subcategories: null
            }
        ]
    },
    {
        name: "Loans",
        i18n_selector: "default.outcomecategory.debt.name",
        icon: JSON.stringify({ lib: "fa", name: "FaCreditCard" }),
        subcategories: [
            {
                name: "Loan repayments",
                i18n_selector: "default.outcomecategory.debt.sub.loanrepayments",
                subcategories: null
            }
        ]
    },
    {
        name: "Other",
        i18n_selector: "default.outcomecategory.other.name",
        icon: JSON.stringify({ lib: "md", name: "MdMoreHoriz" }),
        subcategories: null
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
    fromAssets?: AssetAllocation[];
    toAssets?: AssetAllocation[];
    associatedPendingsId?: string[];
    notes?: string;

    constructor(uid: string, date = new Date(), description: string, type: TransactionType, category: Category, amount: number, fromAssets?: AssetAllocation[], toAssets?: AssetAllocation[], associatedPendingsId?: string[], notes?: string, creationTime: number = new Date().getTime()) {
        this.uid = uid;
        this.date = date;
        this.description = description;
        this.type = type;
        this.category = category;
        this.amount = amount;
        this.fromAssets = fromAssets;
        this.toAssets = toAssets;
        this.associatedPendingsId = associatedPendingsId;
        this.notes = notes;
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
            fromAssets: transaction.fromAssets,
            toAssets: transaction.toAssets,
            associatedPendingsId: transaction.associatedPendingsId,
            notes: transaction.notes,
            creationTime: transaction.creationTime
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        const transaction = new Transaction(data.uid, data.date, data.description, data.type, data.category, data.amount, data.fromAssets, data.toAssets, data.associatedPendingsId, data.notes, data.creationTime);
        transaction.id = snapshot.id;
        return transaction;
    }
};