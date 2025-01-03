import { doc, getDoc, setDoc, getDocs, collection, onSnapshot } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import Transaction, { transactionConverter, TransactionType } from "../model/Transaction";
import { getAuth } from "firebase/auth";
import Controller from "./Controller";
import { DataContext } from "../../app/PersonalArea";
import UserController from "./UserController";
import AssetsController from "./AssetsController";

export default class TransactionsController extends Controller {
    userController?: UserController;
    assetsController?: AssetsController;

    constructor(context: DataContext) {
        super(context);
    };

    ListenForTransactionUpdates(uid: string, onUpdate: (transactions: Transaction[]) => void): () => void {
        const transactionsCollectionRef = collection(db, 'Users', uid, 'Transactions').withConverter(transactionConverter);

        // Set up real-time listener
        const unsubscribe = onSnapshot(transactionsCollectionRef, (querySnapshot) => {
            const retrievedTransactions = querySnapshot.docs.map((doc) => doc.data());
            onUpdate(retrievedTransactions);
        });

        // Return the unsubscribe function for cleanup
        return unsubscribe;
    }

    async GetUserTransactions () {

    }
    
    async CreateTransaction (transaction: Transaction) {
        return true;
    }
    
    async UpdateTransaction (updatedTransaction: Transaction) {
    
    }
    
    async RemoveTransaction (transaction: Transaction) {
    
    }
    
    async CreateNewCategory (transactionType: TransactionType, category: string) {
    
    }

}

