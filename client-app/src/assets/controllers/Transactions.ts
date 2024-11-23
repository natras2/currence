import { doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import Transaction, { TransactionType } from "../model/Transaction";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

export function CreateNewTransaction (transaction: Transaction) {

}

export function UpdateTransaction (updatedTransaction: Transaction) {

}

export function RemoveTransaction (transaction: Transaction) {

}

export function CreateNewCategory (transactionType: TransactionType, category: string) {

}