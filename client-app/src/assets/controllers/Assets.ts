import { doc, getDoc, setDoc, getDocs, collection, addDoc, updateDoc, increment } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import Asset, { assetConverter } from "../model/Asset";
import { DataContext } from "../../app/PersonalArea";
import Controller from "./Controller";

export default class AssetsController extends Controller {
    constructor(context: DataContext) {
        super(context);
    };

    async UpdateFavourite(assetId: string, updatedStarred: boolean) {
        try {
            const assetRef = doc(db, 'Users', this.user.uid, "Assets", assetId).withConverter(assetConverter);

            // update starred reference
            await updateDoc(assetRef, {
                starred: updatedStarred
            });

            const updatedAssetsList = [...this.assets];
            const updatedAsset = updatedAssetsList.find(asset => (asset.id === assetId))!
            updatedAsset.starred = updatedStarred;
            this.setAssets(updatedAssetsList);

            return true;
        }
        catch (error) {
            console.error("An error occurred while updating the favourite: ", error);
            return false;
        }
    }

    async GetUserAssets() {
        const assetsCollectionRef = collection(db, 'Users', this.user.uid, 'Assets').withConverter(assetConverter);

        try {
            const assetsCollectionInstance = await getDocs(assetsCollectionRef);

            if (assetsCollectionInstance.empty)
                return null;

            const assetArray = assetsCollectionInstance.docs.map(doc => doc.data());
            return assetArray;
        }
        catch (error) {
            console.error("Error fetching user assets:", error);
        }
    }

    async CreateAsset(asset: Asset) {
        try {
            const assetCollectionRef = collection(db, 'Users', asset.uid, "Assets").withConverter(assetConverter);
            const createdAssetRef = await addDoc(assetCollectionRef, asset);

            // update user setting first access to false
            await updateDoc(doc(db, "Users", asset.uid), {
                firstAccess: false,
                totalBalance: increment((!asset.hiddenFromTotal) ? asset.balance : 0)
            });
            
            const createdAsset = (await getDoc(createdAssetRef)).data()!;
            this.setAssets((prevAsset) => [...prevAsset, createdAsset]);

            return true;
        }
        catch (error) {
            console.error("Error creating a new asset:", error);
            return false;
        }
    }
}

export async function GetUserAssets(uid: string) {
    const assetsCollectionRef = collection(db, 'Users', uid, 'Assets').withConverter(assetConverter);

    try {
        const assetsCollectionInstance = await getDocs(assetsCollectionRef);

        if (assetsCollectionInstance.empty)
            return null;

        const assetArray = assetsCollectionInstance.docs.map(doc => doc.data());
        return assetArray;
    }
    catch (error) {
        console.error("Error fetching user assets:", error);
    }
}

