import { Injectable } from '@angular/core';
import { Database, ref, set, get, child } from '@angular/fire/database';
import { Box } from '../main/main';
import { collection, doc, Firestore, getDoc, getDocs, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(private db: Database, private firestore: Firestore) {}

  private DB_PATH = 'boxes';

  async getBoxes(): Promise<Box[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'boxes'));
    return querySnapshot.docs.map(doc => doc.data() as Box);
  }
  
  async addBox(box: Box) {
    const boxRef = doc(collection(this.firestore, 'boxes'), box.id.toString());
    await setDoc(boxRef, box);
  }

  async getBoxById(boxId: number): Promise<Box | null> {
    try {
      const boxRef = doc(collection(this.firestore, 'boxes'), boxId.toString());
      const boxSnap = await getDoc(boxRef);
      if (boxSnap.exists()) {
        return boxSnap.data() as Box;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Error fetching box:', err);
      return null;
    }
  }

  async updateBox(box: Box): Promise<void> {
    try {
      const boxRef = doc(collection(this.firestore, 'boxes'), box.id.toString());
      await setDoc(boxRef, box, { merge: true });
    } catch (err) {
      console.error('Error updating box:', err);
      throw err;
    }
  }
}