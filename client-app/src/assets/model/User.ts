import { Category } from "./Transaction";

export default class User {
    id?: string;
    uid: string;
    fullName: string;
    email: string;
    emailVerified: boolean;
    incomeCategories: Category[];
    expenceCategories: Category[];
    totalBalance: number;
    firstAccess: boolean;

    constructor(uid: string, fullName: string, email: string, emailVerified: boolean, incomeCategories: Category[], expenceCategories: Category[], totalBalance: number, firstAccess = true) {
        this.uid = uid;
        this.fullName = fullName;
        this.email = email;
        this.emailVerified = emailVerified;
        this.incomeCategories = incomeCategories;
        this.expenceCategories = expenceCategories;
        this.totalBalance = totalBalance;
        this.firstAccess = firstAccess;
    }
}

// Firestore data converter
export const userConverter = {
    toFirestore: (user: User) => {
        return {
            uid: user.uid,
            fullName: user.fullName,
            email: user.email,
            emailVerified: user.emailVerified,
            incomeCategories: user.incomeCategories,
            expenceCategories: user.expenceCategories,
            totalBalance: user.totalBalance,
            firstAccess: user.firstAccess
        };
    },
    fromFirestore: (snapshot: any, options: any): User => {
        const data = snapshot.data(options);
        const user = new User(data.uid, data.fullName, data.email, data.emailVerified, data.incomeCategories, data.expenceCategories, data.totalBalance, data.firstAccess);
        user.id = snapshot.id;
        return user;
    }
};