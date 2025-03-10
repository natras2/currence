import { doc, getDoc, setDoc, getDocs, collection, addDoc, updateDoc, increment, deleteDoc, onSnapshot } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import Asset, { assetConverter } from "../model/Asset";
import { DataContext } from "../../app/PersonalArea";
import Controller from "./Controller";
import UserController from "./UserController";
import TransactionsController from "./TransactionsController";

export default class AssetsController extends Controller {
    userController?: UserController;
    transactionsController?: TransactionsController;

    constructor(context: DataContext) {
        super(context);
    };

    async UpdateBalance(assetId: string, amount: number, isIncremental: boolean = true) {
        try {
            const assetRef = doc(db, 'Users', this.user.uid, "Assets", assetId).withConverter(assetConverter);

            // update asset balance
            await updateDoc(assetRef, {
                balance: (isIncremental) ? increment(amount) : amount
            });

            return true;
        }
        catch (error) {
            console.error("An error occurred while updating the asset balance: ", error);
            return false;
        }
    }
    async UpdateHiddenFromTotal(assetId: string, updatedHiddenFromTotal: boolean) {
        try {
            const assetRef = doc(db, 'Users', this.user.uid, "Assets", assetId).withConverter(assetConverter);

            // update hidden from total selector
            await updateDoc(assetRef, {
                hiddenFromTotal: updatedHiddenFromTotal
            });

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
            
            const addedDoc = await addDoc(assetCollectionRef, asset);

            // update user setting first access to false
            await updateDoc(doc(db, "Users", asset.uid), {
                firstAccess: false
            });

            const createdAsset = await getDoc(addedDoc);

            return (createdAsset) ? createdAsset.data()! : null;
        }
        catch (error) {
            console.error("Error creating a new asset:", error);
            return null;
        }
    }

    async DeleteAsset(assetId: string) {
        try {
            const asset = this.assets.find((asset) => asset.id === assetId);
            if (!asset)
                throw new Error("The asset targeted for deletion doesn't exist");

            const transactionsList = this.transactions.filter((transaction) => {
                ((transaction.fromAssets && transaction.fromAssets.find((el) => el.assetId === assetId))
                    || (transaction.toAssets && transaction.toAssets.find((el) => el.assetId === assetId)))
            })

            if (transactionsList && transactionsList.length > 0)
                return false;

            const assetRef = doc(db, 'Users', this.user.uid, "Assets", assetId).withConverter(assetConverter);

            await deleteDoc(assetRef);

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

