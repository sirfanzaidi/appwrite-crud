import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Fetch a specific interpretation
async function fetchInterpretation(id: string) {
  try {
    const interpretation = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "interpretations",
      id
    );
    return interpretation;
  } catch (error: any) {
    console.error("Error fetching interpretation:", error);
    throw new Error(error?.message || "Failed to fetch interpretation");
  }
}

// Delete a specific interpretation
async function deleteInterpretation(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "interpretations",
      id
    );
    return response;
  } catch (error: any) {
    console.error("Error deleting interpretation:", error);
    throw new Error(error?.message || "Failed to delete interpretation");
  }
}

// Update a specific interpretation
async function updateInterpretation(
  id: string,
  data: { term: string; interpretation: string }
) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "interpretations",
      id,
      data
    );
    return response;
  } catch (error: any) {
    console.error("Error updating interpretation:", error);
    throw new Error(error?.message || "Failed to update interpretation");
  }
}

// GET handler
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("Params received:", params); // Debugging purpose
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { error: "Interpretation ID is required" },
        { status: 400 }
      );
    }
    const interpretation = await fetchInterpretation(id);
    return NextResponse.json({ interpretation });
  } catch (error: any) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch interpretation" },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteInterpretation(id);
    return NextResponse.json({ message: "Interpretation deleted" });
  } catch (error: any) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete interpretation" },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const interpretation = await req.json();
    await updateInterpretation(id, interpretation);
    return NextResponse.json({ message: "Interpretation updated" });
  } catch (error: any) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update interpretation" },
      { status: 500 }
    );
  }
}
