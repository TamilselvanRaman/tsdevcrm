import { NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { db, auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";

async function ensureServerAuth() {
  if (!auth.currentUser) {
    try {
      await signInWithEmailAndPassword(auth, "ceittamilselvanr26@tsdev.io", "Admin@Tamil1234");
    } catch (e) {
      // Ignore auth errors if unauthenticated writes allowed
    }
  }
}

export async function handleGetCollection(collectionName: string) {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    const data: any[] = [];
    querySnapshot.forEach((docSnap) => {
      data.push({ id: docSnap.id, ...docSnap.data() });
    });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

export async function handleGetDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, error: `${collectionName} record with ID ${id} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: { id: docSnap.id, ...docSnap.data() } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch document" },
      { status: 500 }
    );
  }
}

export async function handleCreateDocument(
  collectionName: string,
  request: Request,
  schema: ZodSchema,
  idPrefix: string
) {
  try {
    await ensureServerAuth();
    const body = await request.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data as any;
    const docId = validatedData.id || `${idPrefix}-${Date.now()}`;
    const documentData = { ...validatedData, id: docId };

    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, documentData, { merge: true });

    return NextResponse.json(
      {
        success: true,
        message: `${collectionName} record saved successfully`,
        data: documentData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(`Error in handleCreateDocument [${collectionName}]:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save record", stack: error.stack },
      { status: 500 }
    );
  }
}

export async function handleUpdateDocument(
  collectionName: string,
  id: string,
  request: Request,
  schema: ZodSchema
) {
  try {
    await ensureServerAuth();
    const body = await request.json();
    const partialSchema = (schema as any).partial();
    const validation = partialSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, validation.data);

    return NextResponse.json(
      {
        success: true,
        message: `${collectionName} record updated successfully`,
        data: { id, ...validation.data },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update record" },
      { status: 500 }
    );
  }
}

export async function handleDeleteDocument(collectionName: string, id: string) {
  try {
    await ensureServerAuth();
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return NextResponse.json(
      {
        success: true,
        message: `${collectionName} record ${id} deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete record" },
      { status: 500 }
    );
  }
}
