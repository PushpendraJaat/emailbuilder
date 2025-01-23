"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function Templates() {
  const [pageLoading, setPageLoading] = useState(true);
  const [layout, setLayout] = useState("");
  interface Template {
    _id: string;
    title: string;
    content: string;
    imageUrl: string;
  }

  const [templates, setTemplates] = useState<Template[]>([]); // Store templates fetched from MongoDB
  const [message, setMessage] = useState(""); // Store success message

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Fetch layout and templates in parallel
        const [layoutResponse, templatesResponse] = await Promise.all([
          fetch("/api/getEmailLayout"),
          fetch("/api/getTemplates"),
        ]);

        // Handle layout response
        if (!layoutResponse.ok) throw new Error("Failed to fetch email layout");
        const layoutData = await layoutResponse.text();
        console.log(layoutData);
        
        setLayout(layoutData);

        // Handle templates response
        if (!templatesResponse.ok) throw new Error("Failed to fetch templates");
        const templatesData = await templatesResponse.json();
        console.log(templatesData);
        

        if (templatesData.success && Array.isArray(templatesData.data)) {
          setTemplates(templatesData.data); // Save templates
          setMessage(templatesData.message); // Save success message
        } else {
          throw new Error("Invalid data format for templates");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <>
      {pageLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {message || "Email Templates"}
          </h2>

          {/* Render templates as cards */}
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template, index) => (
                <Card
                  key={template._id || index}
                  className="shadow-lg border border-gray-200 rounded-lg"
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {template.title || `Template ${index + 1}`}
                    </h3>
                    <div
                      className="border border-dashed border-gray-300 bg-white p-6 rounded-md shadow-sm"
                      dangerouslySetInnerHTML={{
                        __html: layout
                          .replace(/{{title}}/g, template.title || "Default Title")
                          .replace(/{{content}}/g, template.content || "Default Content")
                          .replace(/{{imageUrl}}/g, template.imageUrl || "/path/to/default-image.jpg"),
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No templates available.</p>
          )}
        </div>
      )}
    </>
  );
}
