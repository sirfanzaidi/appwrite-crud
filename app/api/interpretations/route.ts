import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Create interpretation
async function createInterpretation(data: {
  term: string;
  interpretation: string
}) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "interpretations",
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating interpretation:", error);
    return NextResponse.json({ error: "Failed to create interpretation" }, { status: 500 });
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
  } catch (error) {
    console.error("Error fetching interpretations:", error);
    return NextResponse.json({ error: "Failed to fetch interpretations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };
    const response = await createInterpretation(data);
    return NextResponse.json({ message: "Interpretation created" });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Failed to create interpretation" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const interpretations = await fetchInterpretation();
    return NextResponse.json(interpretations);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: "Failed to fetch interpretations" }, { status: 500 });
  }
}