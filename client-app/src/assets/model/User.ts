export default class User {
    uid: string;
    fullName: string;
    email: string;
    emailVerified: boolean;
    photoUrl?: string;

    constructor(uid: string, fullName: string, email: string, emailVerified: boolean, photoUrl?: string) {
        this.uid = uid;
        this.fullName = fullName;
        this.email = email;
        this.emailVerified = emailVerified;
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
        return new User(data.uid, data.fullName, data.email, data.emailVerified, data.photoUrl);
    }
};