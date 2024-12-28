import { DataContext, PersonalAreaContext } from "../../app/PersonalArea";
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

    constructor (data: DataContext) {
        this.user = data.user;
        this.setUser = data.setUser;
        this.assets = data.assets;
        this.setAssets = data.setAssets;
        this.transactions = data.transactions;
        this.setTransactions = data.setTransactions;
        this.userProcessing = data.userProcessing;
        this.assetsProcessing = data.assetsProcessing; 
        this.transactionsProcessing = data.transactionsProcessing;
    };
}
