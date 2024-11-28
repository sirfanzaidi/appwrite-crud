import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Create interpretation
async function createInterpretation(data: { term: string; interpretation: string }) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "interpretations",
      ID.unique(),
      data
    );
    return response;
  } catch (error: any) {
    console.error("Error creating interpretation:", error);
    throw new Error(error?.message || "Failed to create interpretation");
  }
}

// Fetch interpretations
async function fetchInterpretation() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "interpretations",
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error: any) {
    console.error("Error fetching interpretations:", error);
    throw new Error(error?.message || "Failed to fetch interpretations");
  }
}

// POST handler - Create a new interpretation
export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    if (!term || !interpretation) {
      return NextResponse.json(
        { error: "Term and interpretation are required" },
        { status: 400 }
      );
    }
    const data = { term, interpretation };
    await createInterpretation(data);
    return NextResponse.json({ message: "Interpretation created successfully" });
  } catch (error: any) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create interpretation" },
      { status: 500 }
    );
  }
}

// GET handler - Fetch all interpretations
export async function GET() {
  try {
    const interpretations = await fetchInterpretation();
    return NextResponse.json(interpretations);
  } catch (error: any) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch interpretations" },
      { status: 500 }
    );
  }
}
