import { DataContext, PersonalAreaContext } from "../../app/PersonalArea";
import User from "../model/User";
import Asset from "../model/Asset";
import Transaction from "../model/Transaction";

export default class Controller {
    user: User;
    assets: Asset[];
    transactions: Transaction[];
    userProcessing: boolean;
    assetsProcessing: boolean;
    transactionsProcessing: boolean;

    constructor (data: DataContext) {
        this.user = data.user;
        this.assets = data.assets;
        this.transactions = data.transactions;
        this.userProcessing = data.userProcessing;
        this.assetsProcessing = data.assetsProcessing; 
        this.transactionsProcessing = data.transactionsProcessing;
    };
}
