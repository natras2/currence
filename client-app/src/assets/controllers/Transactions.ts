import { doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import { TransactionType } from "../model/Transaction";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

export function CreateNewTransaction (transactionType: TransactionType) {
    
}