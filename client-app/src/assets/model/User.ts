export default class User {
    public id?: string;
    uid: string;
    fullName: string;
    email: string;
    emailVerified: boolean;
    photoUrl?: string;
    incomeCategories: Object;
    expenceCategories: Object;

    constructor(uid: string, fullName: string, email: string, emailVerified: boolean, incomeCategories: Object, expenceCategories: Object, photoUrl?: string) {
        this.uid = uid;
        this.fullName = fullName;
        this.email = email;
        this.emailVerified = emailVerified;
        this.incomeCategories = incomeCategories;
        this.expenceCategories = expenceCategories;
        this.photoUrl = photoUrl;
    }
    toString() {
        return this.uid + ', ' + this.fullName + ', ' + this.email + ', ' + this.emailVerified;
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
            photoUrl: user.photoUrl
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        const user = new User(data.uid, data.fullName, data.email, data.incomeCategories, data.expenceCategories, data.emailVerified, data.photoUrl);
        user.id = snapshot.id; 
        return user;
    }
};