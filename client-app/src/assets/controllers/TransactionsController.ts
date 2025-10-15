import { getDoc, getDocs, collection, onSnapshot, addDoc, query, Timestamp, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Transaction, { SelectedCategory, transactionConverter, TransactionType } from "../model/Transaction";
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

    // Listen only to recent transactions
    ListenForRecentTransactions(uid: string, daysBack: number = 60, onUpdate: (transactions: Transaction[]) => void
    ): () => void {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysBack);

        const transactionsQuery = query(
            collection(db, 'Users', uid, 'Transactions').withConverter(transactionConverter),
            where('date', '>=', Timestamp.fromDate(cutoffDate)),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(transactionsQuery, (querySnapshot) => {
            const retrievedTransactions = querySnapshot.docs.map((doc) => doc.data());
            onUpdate(retrievedTransactions);
        });

        return unsubscribe;
    }

    // Load older transactions on demand (for "Load More" functionality)
    async GetOlderTransactions(
        uid: string,
        beforeDate: Date,
        limitCount: number = 50
    ): Promise<Transaction[]> {
        try {
            const snapshot = await getDocs(
                query(
                    collection(db, 'Users', uid, 'Transactions').withConverter(transactionConverter),
                    where('date', '<', Timestamp.fromDate(beforeDate)),
                    orderBy('date', 'desc'),
                    limit(limitCount)
                )
            );

            const transactions = snapshot.docs.map(doc => doc.data());
            console.log(`Loaded ${transactions.length} older transactions`);
            return transactions;
        } catch (error) {
            console.error("Error loading older transactions:", error);
            return [];
        }
    }

    async GetTransactionsForDateRange(
        uid: string,
        startDate: Date,
        endDate: Date
    ): Promise<Transaction[]> {
        try {
            const snapshot = await getDocs(
                query(
                    collection(db, 'Users', uid, 'Transactions').withConverter(transactionConverter),
                    where('date', '>=', Timestamp.fromDate(startDate)),
                    where('date', '<=', Timestamp.fromDate(endDate)),
                    orderBy('date', 'asc')
                )
            );

            const transactions = snapshot.docs.map(doc => doc.data());
            console.log(`Loaded ${transactions.length} transactions for chart (${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()})`);
            return transactions;
        } catch (error) {
            console.error("Error loading transactions for date range:", error);
            return [];
        }
    }

    CheckTransaction(transaction: Transaction, errorMonitor: (errorsList: string[]) => void): boolean {
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
        if (transaction.type !== TransactionType.TRANSFER && !transaction.description) {
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
        switch (transaction.type) {
            case TransactionType.EXPENCE:
                if (!transaction.fromAssets) {
                    result = false
                    errorList.push("MISSING MANDATORY FIELDS: fromAssets");
                }
                else {
                    if (transaction.fromAssets.length === 1) {
                        transaction.fromAssets[0].amount = transaction.amount
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
                }
                break;
            case TransactionType.INCOME:
                if (!transaction.toAssets) {
                    result = false
                    errorList.push("MISSING MANDATORY FIELDS: toAssets");
                }
                else {
                    if (transaction.toAssets.length === 1) {
                        transaction.toAssets[0].amount = transaction.amount
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
                }
                break;
            case TransactionType.TRANSFER:
                if (!transaction.fromAssets
                    || !transaction.toAssets
                    || !transaction.fromAssets[0]
                    || !transaction.toAssets[0]
                    || !transaction.fromAssets[0].assetId || !this.assets.find((asset) => asset.id === transaction.fromAssets![0].assetId)
                    || !transaction.toAssets[0].assetId || !this.assets.find((asset) => asset.id === transaction.toAssets![0].assetId)) {
                    result = false
                    errorList.push("TRANSFER: MISSING ASSET ALLOCATIONS");
                }
                else {
                    if (transaction.fromAssets.length === 1 && transaction.toAssets.length === 1) {
                        transaction.fromAssets[0].amount = transaction.amount
                        transaction.toAssets[0].amount = transaction.amount
                    }
                    else {
                        let amountFromAllocations = 0;
                        let amountToAllocations = 0;
                        transaction.fromAssets.forEach((allocation) => {
                            if (!this.assets.find((asset) => asset.id === allocation.assetId)
                                || !allocation.amount || allocation.amount <= 0) {
                                result = false
                                errorList.push("TRANSFER: INCOMPLETE OR INCORRECT ASSET ALLOCATIONS");
                            }
                            else amountFromAllocations += allocation.amount;
                        })
                        transaction.toAssets.forEach((allocation) => {
                            if (!this.assets.find((asset) => asset.id === allocation.assetId)
                                || !allocation.amount || allocation.amount <= 0) {
                                result = false
                                errorList.push("TRANSFER: INCOMPLETE OR INCORRECT ASSET ALLOCATIONS");
                            }
                            else amountToAllocations += allocation.amount;
                        })
                        if (amountFromAllocations !== transaction.amount) {
                            result = false
                            errorList.push("TRANSFER: ASSET ALLOCATIONS AMOUNTS NOT CORRESPONDING TO TRANSACTION'S AMOUNT");
                        }
                    }
                }

                break;
        }

        errorMonitor(errorList);

        return result;
    }

    async CreateTransaction(transaction: Transaction) {
        Object.keys(transaction).forEach(key => transaction[key as keyof Transaction] === undefined ? delete transaction[key as keyof Transaction] : {});
        console.log(transaction);

        try {
            const transactionCollectionRef = collection(db, 'Users', transaction.uid, "Transactions").withConverter(transactionConverter);

            const addedDoc = await addDoc(transactionCollectionRef, transaction);

            // update involved asset balance
            switch (transaction.type) {
                case TransactionType.EXPENCE:
                    if (transaction.fromAssets && transaction.fromAssets.length > 0) {
                        transaction.fromAssets.forEach(async (allocation) => {
                            await this.assetsController?.UpdateBalance(allocation.assetId, allocation.amount * -1)
                        })
                    }
                    else throw (new Error("EXPENCE: Mandatory field [fromAssetId] has not been fulfilled properly"))
                    break;
                case TransactionType.INCOME:
                    if (transaction.toAssets && transaction.toAssets.length > 0) {
                        transaction.toAssets.forEach(async (allocation) => {
                            await this.assetsController?.UpdateBalance(allocation.assetId, allocation.amount)
                        })
                    }
                    else throw (new Error("INCOME: Mandatory field [toAssetId] has not been fulfilled properly"))
                    break;
                case TransactionType.TRANSFER:
                    if (transaction.fromAssets && transaction.toAssets) {
                        await this.assetsController?.UpdateBalance(transaction.fromAssets[0].assetId, transaction.fromAssets[0].amount * -1)
                        await this.assetsController?.UpdateBalance(transaction.toAssets[0].assetId, transaction.toAssets[0].amount)
                    }
                    else throw (new Error("TRANSFER: Mandatory fields [fromAssetId, toAssetId] have not been fulfilled properly"))
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

    async UpdateTransaction(updatedTransaction: Transaction) {

    }

    async RemoveTransaction(transaction: Transaction) {

    }

    async CreateNewCategory(transactionType: TransactionType, category: SelectedCategory) {

    }

}

