export default class Asset {
    id?: string;
    uid: string;
    name: string;
    balance: number;
    hiddenFromTotal: boolean;
    creationTime: number;
    
    constructor(uid: string, name:string, balance: number, hiddenFromTotal: boolean = false, creationTime: number = new Date().getTime()) {
        this.uid = uid;
        this.name = name;
        this.balance = balance;
        this.hiddenFromTotal = hiddenFromTotal;
        this.creationTime = creationTime
    }
}

export const assetConverter = {
    toFirestore: (asset: Asset) => {
        return {
            uid: asset.uid,
            name: asset.name,
            balance: asset.balance,
            hiddenFromTotal: asset.hiddenFromTotal,
            creationTime: asset.creationTime
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        const asset = new Asset(data.uid, data.name, data.balance, data.hiddenFromTotal, data.creationTime);
        asset.id = snapshot.id;
        return asset;
    }
};