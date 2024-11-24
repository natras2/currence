import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import { app, db } from "../../firebase/firebaseConfig";
import Asset, { assetConverter } from "../model/Asset";

export async function GetUserAssets (uid: string) {
    const assetsCollectionRef = collection(db, 'Users', uid, 'Assets').withConverter(assetConverter);
    const assetsCollectionInstance = await getDocs(assetsCollectionRef);

    if (assetsCollectionInstance.empty) 
        return null;
    
    
}