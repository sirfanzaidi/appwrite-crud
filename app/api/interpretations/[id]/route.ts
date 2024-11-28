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
  } catch (error) {
    console.error("Error fetching interpretations:", error);
    return NextResponse.json({ error: "Failed to fetch interpretation" }, { status: 500 });
  }
}

// Delete a specific Interpretation
async function deleteInterpretation(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "interpretations",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting interpretations:", error);
    return NextResponse.json({ error: "Failed to delete interpretation" }, { status: 500 });
  }
}

// Update a specific Interpretation
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
  } catch (error) {
    console.error("Error updating interpretations:", error);
    return NextResponse.json({ error: "Failed to update interpretation" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log("Params received:", params); // Add this for debugging
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
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch interpretation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteInterpretation(id);
    return NextResponse.json({ message: "Interpretation deleted" });
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { error: "Failed to delete interpretation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const interpretation = await req.json();
    await updateInterpretation(id, interpretation);
    return NextResponse.json({ message: "Interpretation updated" });
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      { error: "Failed to update interpretation" },
      { status: 500 }
    );
  }
}