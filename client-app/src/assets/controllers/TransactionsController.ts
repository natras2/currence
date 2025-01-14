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

    CheckTransaction (transaction: Transaction, callbackErrorList: (errorsList : string[]) => void): boolean {
        let result = true;
        let errorList: string[] = [];

        //CHECK FOR MISSING MANDATORY FIELDS
        if (!transaction.uid) {
            result = false;
            errorList.push("MISSING MANDATORY FIELDS: uid");
        }
        if (!transaction.type) {
            result = false;
            errorList.push("MISSING MANDATORY FIELDS: type");
        }
        if (!transaction.date || transaction.date.getTime() > Date.now()) {
            result = false;
            errorList.push("MISSING MANDATORY FIELDS: date");
        }
        if (!transaction.description) {
            result = false;
            errorList.push("MISSING MANDATORY FIELDS: description");
        }
        if (!transaction.category) {
            result = false;
            errorList.push("MISSING MANDATORY FIELDS: category");
        }
        if (!transaction.amount || transaction.amount <= 0) {
            result = false;
            errorList.push("MISSING MANDATORY FIELDS: amount");
        }
        if (!transaction.creationTime) {
            result = false;
            errorList.push("MISSING MANDATORY FIELDS: creationTime");
        }

        //CHECK FOR MISSING ASSET ALLOCATIONS AND ALLOCATION COHERENCE TO TOTAL AMOUNT
        switch(transaction.type) {
            case TransactionType.EXPENCE: 
                if (!transaction.fromAssets) {
                    result = false
                    errorList.push("MISSING MANDATORY FIELDS: fromAssets");
                }
                else {
                    let amountFromAllocations = 0;
                    transaction.fromAssets.forEach((allocation) => {
                        if (!this.assets.find((asset) => asset.id === allocation.assetId)
                            || !allocation.amount || allocation.amount <= 0) {
                            result = false
                            errorList.push("EXPENCE: MISSING, INCOMPLETE OR INCORRECT ASSET ALLOCATIONS");
                        }
                        else amountFromAllocations += allocation.amount;
                    })
                    if (amountFromAllocations !== transaction.amount) {
                        result = false
                        errorList.push("EXPENCE: ASSET ALLOCATIONS AMOUNTS NOT CORRESPONDING TO TRANSACTION'S AMOUNT");
                    }
                }
                break;
            case TransactionType.INCOME:  
                if (!transaction.toAssets) {
                    result = false
                    errorList.push("MISSING MANDATORY FIELDS: toAssets");
                }
                else {
                    let amountFromAllocations = 0;
                    transaction.toAssets.forEach((allocation) => {
                        if (!this.assets.find((asset) => asset.id === allocation.assetId)
                            || !allocation.amount || allocation.amount <= 0) {
                            result = false
                            errorList.push("INCOME: MISSING, INCOMPLETE OR INCORRECT ASSET ALLOCATIONS");
                        }
                        else amountFromAllocations += allocation.amount;
                    })
                    if (amountFromAllocations !== transaction.amount) {
                        result = false
                        errorList.push("INCOME: ASSET ALLOCATIONS AMOUNTS NOT CORRESPONDING TO TRANSACTION'S AMOUNT");
                    }
                }
                break;
            case TransactionType.TRANSFER: 
                if (!transaction.fromAssets 
                    || !transaction.toAssets 
                    || !transaction.fromAssets[0] 
                    || !transaction.toAssets[0]
                    || !transaction.fromAssets[0].assetId || !this.assets.find((asset) => asset.id === transaction.fromAssets![0].assetId)
                    || !transaction.toAssets[0].assetId || !this.assets.find((asset) => asset.id === transaction.toAssets![0].assetId)
                    || !transaction.fromAssets[0].amount || transaction.fromAssets[0].amount !== transaction.amount
                    || !transaction.toAssets[0].amount || transaction.toAssets[0].amount !== transaction.amount) {
                    errorList.push("TRANSFER: MISSING, INCOMPLETE OR INCORRECT ASSET ALLOCATIONS");
                }
                break;
        }

        return result;
    }
    
    async CreateTransaction (transaction: Transaction) {
        try {
            const transactionCollectionRef = collection(db, 'Users', transaction.uid, "Transactions").withConverter(transactionConverter);

            const addedDoc = await addDoc(transactionCollectionRef, transaction);

            // update involved asset balance
            switch(transaction.type) {
                case TransactionType.EXPENCE: 
                    if (transaction.fromAssets && transaction.fromAssets.length > 0) {
                        transaction.fromAssets.forEach(async (allocation) => {
                            await this.assetsController?.UpdateBalance(allocation.assetId, allocation.amount * -1)
                        })
                    }
                    else throw(new Error("EXPENCE: Mandatory field [fromAssetId] has not been fulfilled properly"))
                    break;
                case TransactionType.INCOME: 
                    if (transaction.toAssets && transaction.toAssets.length > 0) {
                        transaction.toAssets.forEach(async (allocation) => {
                            await this.assetsController?.UpdateBalance(allocation.assetId, allocation.amount)
                        })
                    }
                    else throw(new Error("INCOME: Mandatory field [toAssetId] has not been fulfilled properly"))
                    break;
                case TransactionType.TRANSFER: 
                    if (transaction.fromAssets && transaction.toAssets) {
                        await this.assetsController?.UpdateBalance(transaction.fromAssets[0].assetId, transaction.fromAssets[0].amount * -1)
                        await this.assetsController?.UpdateBalance(transaction.toAssets[0].assetId, transaction.toAssets[0].amount)
                    }
                    else throw(new Error("TRANSFER: Mandatory fields [fromAssetId, toAssetId] have not been fulfilled properly"))
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

