import { doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import Transaction, { TransactionType } from "../model/Transaction";
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

