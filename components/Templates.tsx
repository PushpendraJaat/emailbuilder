"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function Images() {
    const [pageLoading, setPageLoading] = useState(true);
    const [layout, setLayout] = useState('');
    const [files, setFiles] = useState([]); // Store file names
    const [templateDataList, setTemplateDataList] = useState([]); // Store templates for preview
    const [message, setMessage] = useState(''); // Store success message

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch email layout and templates in parallel
                const [layoutResponse, templatesResponse] = await Promise.all([
                    fetch('/api/getEmailLayout'),
                    fetch('/api/getTemplates'),
                ]);

                // Handle layout response
                if (!layoutResponse.ok) throw new Error('Failed to fetch email layout');
                const layoutData = await layoutResponse.text();
                setLayout(layoutData);

                // Handle templates response
                if (!templatesResponse.ok) throw new Error('Failed to fetch templates');
                const templatesData = await templatesResponse.json();
                if (templatesData.success && Array.isArray(templatesData.files)) {
                    setFiles(templatesData.files); // Save file names
                    setMessage(templatesData.message); // Save success message
                } else {
                    throw new Error('Invalid data format for templates');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchTemplate = async (file) => {
        try {
            const response = await fetch(`/api/allTemplate/${file}`);
            const data = await response.json();
            console.log('Template data:', data);

            if (data.success) {
                // Parse the stringified JSON template
                const parsedTemplate = JSON.parse(data.template);

                const templateData = {
                    file,
                    title: parsedTemplate.title || 'Default Title',
                    content: parsedTemplate.content || 'Default Content',
                    imageUrl: parsedTemplate.imageUrl || '/path/to/default-image.jpg',
                };

                setTemplateDataList((prevData) => [...prevData, templateData]);
            } else {
                console.error('Failed to fetch template');
            }
        } catch (error) {
            console.error('Error fetching template:', error);
        }
    };

    return (
        <>
            {pageLoading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        {message || 'Template Files'}
                    </h2>

                    {/* Display files list */}
                    {files.length > 0 ? (
                        <ul className="list-disc list-inside mb-6">
                            {files.map((file, index) => (
                                <li
                                    key={index}
                                    className="text-gray-600 cursor-pointer"
                                    onClick={() => fetchTemplate(file)}
                                >
                                    {file}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No templates available.</p>
                    )}

                    {/* Render templates as cards */}
                    {templateDataList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templateDataList.map((template, index) => (
                                <Card key={index} className="shadow-lg border border-gray-200 rounded-lg">
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            {template.file}
                                        </h3>
                                        <div
                                            className="border border-dashed border-gray-300 bg-white p-6 rounded-md shadow-sm"
                                            dangerouslySetInnerHTML={{
                                                __html: layout
                                                    .replace(/{{title}}/g, template.title)
                                                    .replace(/{{content}}/g, template.content)
                                                    .replace(/{{imageUrl}}/g, template.imageUrl),
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No templates to preview.</p>
                    )}
                </div>
            )}
        </>
    );
}
