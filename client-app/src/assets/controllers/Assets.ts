import { doc, getDoc, setDoc, getDocs, collection, addDoc, updateDoc, increment } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import Asset, { assetConverter } from "../model/Asset";

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

export async function CreateAsset (asset: Asset) {
    const assetCollectionRef = collection(db, 'Users', asset.uid, "Assets").withConverter(assetConverter);
    await addDoc(assetCollectionRef, asset);

    // update user setting first access to false
    await updateDoc(doc(db, "Users", asset.uid), {
        firstAccess: false,
        totalBalance: increment((!asset.hiddenFromTotal) ? asset.balance : 0)
    });

    return true;
}

export async function UpdateFavourite (uid: string, assetId: string, updatedStarred: boolean) {
    const assetRef = doc(db, 'Users', uid, "Assets", assetId).withConverter(assetConverter);

    // update starred reference
    await updateDoc(assetRef, {
        starred: updatedStarred
    });

    return true;
}