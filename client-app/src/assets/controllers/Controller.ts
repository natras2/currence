import { DataContext } from "../../app/PersonalArea";
import User from "../model/User";
import Asset from "../model/Asset";
import Transaction from "../model/Transaction";

export default class Controller {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    assets: Asset[];
    setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    userProcessing: boolean;
    assetsProcessing: boolean;
    transactionsProcessing: boolean;

    constructor (context: DataContext) {
        this.user = context.user;
        this.setUser = context.setUser;
        this.assets = context.assets;
        this.setAssets = context.setAssets;
        this.transactions = context.transactions;
        this.setTransactions = context.setTransactions;
        this.userProcessing = context.userProcessing;
        this.assetsProcessing = context.assetsProcessing; 
        this.transactionsProcessing = context.transactionsProcessing
    };
}
