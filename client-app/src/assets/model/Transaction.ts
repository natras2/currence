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
    isOther?: boolean;
    isUpdated: boolean,
    subcategories: Category[] | null
}

export interface SelectedCategory {
    name: string,
    icon?: string,
    i18n_selector?: string,
    progressive?: number,
    isUpdated: boolean,
    parent: SelectedCategory | null
}

export const defaultIncomeCategories: Category[] = [
    {
        name: "Salary & bonuses",
        i18n_selector: "default.incomecategory.salary.name",
        icon: JSON.stringify({ lib: "io", name: "IoIosCash" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Wage",
                i18n_selector: "default.incomecategory.salary.sub.wage",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Pension",
                i18n_selector: "default.incomecategory.salary.sub.pension",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Self-Employment earnings",
                i18n_selector: "default.incomecategory.salary.sub.freelance",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Investments & dividends",
        i18n_selector: "default.incomecategory.investments.name",
        icon: JSON.stringify({ lib: "md", name: "MdTrendingUp" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Stock dividends",
                i18n_selector: "default.incomecategory.investments.sub.stockdividends",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Interest from savings",
                i18n_selector: "default.incomecategory.investments.sub.savingsinterest",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Real Estate income",
                i18n_selector: "default.incomecategory.investments.sub.realestate",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Sales & Business",
        i18n_selector: "default.incomecategory.business.name",
        icon: JSON.stringify({ lib: "bi", name: "BiBriefcase" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Sales",
                i18n_selector: "default.incomecategory.business.sub.sales",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Consulting",
                i18n_selector: "default.incomecategory.business.sub.consulting",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Social benefits",
        i18n_selector: "default.incomecategory.government.name",
        icon: JSON.stringify({ lib: "gi", name: "GiReceiveMoney" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Unemployment benefits",
                i18n_selector: "default.incomecategory.government.sub.unemployment",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Gifts & Donations",
        i18n_selector: "default.incomecategory.gifts.name",
        icon: JSON.stringify({ lib: "fa", name: "FaHandHoldingHeart" }),
        isUpdated: false,
        subcategories: null
    },
    {
        name: "Other",
        i18n_selector: "default.incomecategory.other.name",
        icon: JSON.stringify({ lib: "md", name: "MdMoreHoriz" }),
        isUpdated: false,
        isOther: true,
        subcategories: null
    }
];


export const defaultExpenseCategories: Category[] = [
    {
        name: "Housing & utilities",
        i18n_selector: "default.outcomecategory.housing.name",
        icon: JSON.stringify({ lib: "fa", name: "FaHome" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Rent",
                i18n_selector: "default.outcomecategory.housing.sub.rent",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Mortgage",
                i18n_selector: "default.outcomecategory.housing.sub.mortgage",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Utilities",
                i18n_selector: "default.outcomecategory.housing.sub.utilities",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Food & groceries",
        i18n_selector: "default.outcomecategory.food.name",
        icon: JSON.stringify({ lib: "md", name: "MdRestaurant" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Supermarket",
                i18n_selector: "default.outcomecategory.food.sub.supermarket",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Restaurants",
                i18n_selector: "default.outcomecategory.food.sub.restaurants",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Takeaway & Delivery",
                i18n_selector: "default.outcomecategory.food.sub.takeawaydelivery",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Transportation",
        i18n_selector: "default.outcomecategory.transportation.name",
        icon: JSON.stringify({ lib: "fa", name: "FaCar" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Fuel",
                i18n_selector: "default.outcomecategory.transportation.sub.fuel",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Public transport",
                i18n_selector: "default.outcomecategory.transportation.sub.publictransport",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Car maintenance",
                i18n_selector: "default.outcomecategory.transportation.sub.maintenance",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Car and bike share",
                i18n_selector: "default.outcomecategory.transportation.sub.bikeshare",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Health & medications",
        i18n_selector: "default.outcomecategory.health.name",
        icon: JSON.stringify({ lib: "md", name: "MdLocalHospital" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Health insurance",
                i18n_selector: "default.outcomecategory.health.sub.insurance",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Doctor visits",
                i18n_selector: "default.outcomecategory.health.sub.doctorvisits",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Medications",
                i18n_selector: "default.outcomecategory.health.sub.medications",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Entertainment & hobbies",
        i18n_selector: "default.outcomecategory.entertainment.name",
        icon: JSON.stringify({ lib: "md", name: "MdTheaters" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Cinema",
                i18n_selector: "default.outcomecategory.entertainment.sub.cinema",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Books",
                i18n_selector: "default.outcomecategory.entertainment.sub.books",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Games",
                i18n_selector: "default.outcomecategory.entertainment.sub.hobbies",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Streaming services",
                i18n_selector: "default.outcomecategory.entertainment.sub.subscriptions",
                isUpdated: false,
                subcategories: null
            },
            {
                name: "Gym & fitness",
                i18n_selector: "default.outcomecategory.entertainment.sub.gymfitness",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Loans",
        i18n_selector: "default.outcomecategory.debt.name",
        icon: JSON.stringify({ lib: "fa", name: "FaCreditCard" }),
        isUpdated: false,
        subcategories: [
            {
                name: "Loan repayments",
                i18n_selector: "default.outcomecategory.debt.sub.loanrepayments",
                isUpdated: false,
                subcategories: null
            }
        ]
    },
    {
        name: "Other",
        i18n_selector: "default.outcomecategory.other.name",
        icon: JSON.stringify({ lib: "md", name: "MdMoreHoriz" }),
        isUpdated: false,
        isOther: true,
        subcategories: null
    }
];

export default class Transaction {
    id?: string;
    uid: string;
    date: Date;
    description: string;
    type: TransactionType;
    category: SelectedCategory;
    amount: number;
    creationTime: number;
    fromAssets?: AssetAllocation[];
    toAssets?: AssetAllocation[];
    associatedPendingsId?: string[];
    notes?: string;

    constructor(uid: string, date = new Date(), description: string, type: TransactionType, category: SelectedCategory, amount: number, fromAssets?: AssetAllocation[], toAssets?: AssetAllocation[], associatedPendingsId?: string[], notes?: string, creationTime: number = new Date().getTime()) {
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