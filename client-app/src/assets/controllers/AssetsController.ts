import { doc, getDoc, setDoc, getDocs, collection, addDoc, updateDoc, increment, deleteDoc, onSnapshot } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import Asset, { assetConverter } from "../model/Asset";
import { DataContext } from "../../app/PersonalArea";
import Controller from "./Controller";
import UserController, { UpdateTotalBalance } from "./UserController";
import TransactionsController from "./TransactionsController";

export default class AssetsController extends Controller {
    userController?: UserController;
    transactionsController?: TransactionsController;

    constructor(context: DataContext) {
        super(context);
    };

    async UpdateHiddenFromTotal(assetId: string, updatedHiddenFromTotal: boolean) {
        try {
            const assetRef = doc(db, 'Users', this.user.uid, "Assets", assetId).withConverter(assetConverter);

            // update starred reference
            await updateDoc(assetRef, {
                hiddenFromTotal: updatedHiddenFromTotal
            });

            const updatedAsset = this.assets.find(asset => (asset.id === assetId))!
            const balanceDelta = (updatedHiddenFromTotal) ? updatedAsset.balance * -1  : updatedAsset.balance;

            await this.userController?.UpdateTotalBalance(balanceDelta, true);

            return true;
        }
        catch (error) {
            console.error("An error occurred while updating the favorite: ", error);
            return false;
        }
    }

    async UpdateFavorite(assetId: string, updatedStarred: boolean) {
        try {
            const assetRef = doc(db, 'Users', this.user.uid, "Assets", assetId).withConverter(assetConverter);

            // update starred reference
            await updateDoc(assetRef, {
                starred: updatedStarred
            });

            return true;
        }
        catch (error) {
            console.error("An error occurred while updating the favorite: ", error);
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
            
            await addDoc(assetCollectionRef, asset);

            // update user setting first access to false
            await updateDoc(doc(db, "Users", asset.uid), {
                firstAccess: false,
                totalBalance: increment((!asset.hiddenFromTotal) ? asset.balance : 0)
            });

            return true;
        }
        catch (error) {
            console.error("Error creating a new asset:", error);
            return false;
        }
    }

    async DeleteAsset(assetId: string) {
        try {
            const asset = this.assets.find((asset) => asset.id === assetId);
            if (!asset)
                throw new Error("The asset targeted for deletion doesn't exist");

            const transactionsList = this.transactions.filter((transaction) => {
                ((transaction.fromAssetId && transaction.fromAssetId.includes(assetId))
                    || (transaction.toAssetId && transaction.toAssetId.includes(assetId)))
            })

            if (transactionsList && transactionsList.length > 0)
                return false;

            const assetRef = doc(db, 'Users', this.user.uid, "Assets", assetId).withConverter(assetConverter);
            const assetBalance = asset.balance;

            await deleteDoc(assetRef);
            await this.userController?.UpdateTotalBalance(assetBalance * -1, true);

            return true;
        }
        catch (error) {
            console.error("Error deleting the asset:", error);
            return false;
        }
    }

    ListenForAssetUpdates(uid: string, onUpdate: (assets: Asset[]) => void): () => void {
        const assetsCollectionRef = collection(db, 'Users', uid, 'Assets').withConverter(assetConverter);

        // Set up real-time listener
        const unsubscribe = onSnapshot(assetsCollectionRef, (querySnapshot) => {
            const retrievedAssets = querySnapshot.docs.map((doc) => doc.data());
            onUpdate(retrievedAssets);
        });

        // Return the unsubscribe function for cleanup
        return unsubscribe;
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

