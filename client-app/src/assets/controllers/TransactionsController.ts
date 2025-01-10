import { doc, getDoc, setDoc, getDocs, collection, onSnapshot, addDoc, updateDoc, increment } from "firebase/firestore";
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
        try {
            const transactionCollectionRef = collection(db, 'Users', transaction.uid, "Transactions").withConverter(transactionConverter);

            const addedDoc = await addDoc(transactionCollectionRef, transaction);

            // IMPLEMENT
            // update involved asset 
            switch(transaction.type) {
                case TransactionType.EXPENCE: 
                    //
                    break;
                case TransactionType.INCOME: 
                    //
                    break;
                case TransactionType.TRANSFER: 
                    //
                    break;
            }

            const createdTransaction = await getDoc(addedDoc);

            return (createdTransaction) ? createdTransaction.data()! : null;
        }
        catch (error) {
            console.error("Error creating a new transaction:", error);
            return null;
        }
    }
    
    async UpdateTransaction (updatedTransaction: Transaction) {
    
    }
    
    async RemoveTransaction (transaction: Transaction) {
    
    }
    
    async CreateNewCategory (transactionType: TransactionType, category: string) {
    
    }

}

