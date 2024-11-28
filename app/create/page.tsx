"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function CreatePage() {
  const [formData, setFormData] = useState({ term: "", interpretation: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Handle input changes for both text input and textarea
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.term || !formData.interpretation) {
      setError("Please fill in all the fields.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/interpretations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create interpretation.");
      }

      // Redirect to the home page after successful creation
      router.push(`/`);
    } catch (error) {
      console.error("Error while creating interpretation:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold my-8">Add New Interpretation</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="term"
          placeholder="Enter term"
          value={formData.term}
          className="py-2 px-4 border rounded-md"
          onChange={handleInputChange}
          required
        />
        <textarea
          name="interpretation"
          rows={4}
          placeholder="Enter interpretation"
          value={formData.interpretation}
          className="py-2 px-4 border rounded-md"
          onChange={handleInputChange}
          required
        ></textarea>
        <button
          className="bg-black text-white mt-5 px-4 py-2 rounded-md cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Interpretation"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
