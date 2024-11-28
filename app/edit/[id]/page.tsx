"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

export default function EditPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({ term: "", interpretation: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/interpretations/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch interpretation");
        }
        const data = await response.json();
        console.log(data);
        setFormData({
          term: data.interpretation.term,
          interpretation: data.interpretation.interpretation,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load interpretation.");
      }
    };
    fetchData();
  }, [params.id]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.term || !formData.interpretation) {
      setError("Please fill in all the fields.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/interpretations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update interpretation.");
      }

      router.push(`/`);
    } catch (err) {
      console.error("Error updating interpretation:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Edit Interpretation</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="term"
          placeholder="Enter term"
          value={formData.term}
          onChange={handleInputChange}
          className="py-1 px-4 border rounded-md"
        />
        <textarea
          name="interpretation"
          rows={4}
          placeholder="Enter interpretation"
          value={formData.interpretation}
          onChange={handleInputChange}
          className="py-1 px-4 border rounded-md"
        ></textarea>
        <button
          type="submit"
          className={`mt-4 px-4 py-2 rounded-md text-white ${
            isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-black"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Interpretation"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
