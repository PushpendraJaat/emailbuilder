"use client";

import useSWR from 'swr';
import { Card, CardContent } from "@/components/ui/card";

interface Template {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
}

const fetcher = (url: string) => fetch(url, { cache: "no-cache" }).then(res => res.json());
const textFetcher = (url: string) => fetch(url).then(res => res.text());

export default function Templates() {
  // Fetch email layout
  const { data: layoutData } = useSWR<string>('/api/getEmailLayout', textFetcher);
  
  // Fetch templates with TypeScript type
  const { data: templatesData, error, isLoading } = useSWR<{
    success: boolean;
    data: Template[];
    message: string;
  }>('/api/getTemplates', fetcher);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          Failed to load templates: {error.message}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {templatesData?.message || "Email Templates"}
          </h2>

          {templatesData?.data?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templatesData.data.map((template, index) => (
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
                        __html: (layoutData || "")
                          .replace(/{{title}}/g, template.title || "Default Title")
                          .replace(/{{content}}/g, template.content || "Default Content")
                          .replace(
                            /{{imageUrl}}/g,
                            template.imageUrl || "/path/to/default-image.jpg"
                          ),
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