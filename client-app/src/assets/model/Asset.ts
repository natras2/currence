export enum AssetType {
    CASH = "static.assetType.cash",
    BANKACCOUNT = "static.assetType.bankaccount",
    EWALLET = "static.assetType.ewallet",
    OTHER = "static.assetType.other",
}

export interface AssetAttributes {
    sourceName: string,
    type: AssetType,
    logo: string
}

export default class Asset {
    id?: string;
    uid: string;
    name: string;
    attributes: AssetAttributes;
    description: string;
    starred: boolean;
    balance: number;
    hiddenFromTotal: boolean;
    creationTime: number;
    
    constructor(uid: string, name:string, attributes: AssetAttributes, description: string, balance: number, starred: boolean = false, hiddenFromTotal: boolean = false, creationTime: number = new Date().getTime()) {
        this.uid = uid;
        this.name = name;
        this.attributes = attributes;
        this.description = description;
        this.starred = starred;
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
            attributes: asset.attributes,
            description: asset.description,
            starred: asset.starred,
            balance: asset.balance,
            hiddenFromTotal: asset.hiddenFromTotal,
            creationTime: asset.creationTime
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        const asset = new Asset(data.uid, data.name, data.attributes, data.description, data.balance, data.starred, data.hiddenFromTotal, data.creationTime);
        asset.id = snapshot.id;
        return asset;
    }
};