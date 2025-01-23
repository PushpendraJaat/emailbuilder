"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Image from "next/image";

export default function Images() {
    const [pageLoading, setPageLoading] = useState(true);
    const [itemData, setItemData] = useState<{ url: string }[]>([]); // Initialize as an empty array with type

    useEffect(() => {
        const fetchImages = async () => {
            try {
                
                const response = await fetch("/api/getImages"{
                    cache: "no-cache
                }); // API endpoint
                if (!response.ok) throw new Error("Failed to fetch images");

                const data = await response.json(); // Parse the response as JSON
                console.log(data);
                

                if (data.success && Array.isArray(data.files)) {
                    console.log("Fetched images:", data);
                    setItemData(data.files); // Update state with image URLs
                    console.log("Fetched images:", itemData);
                } else {
                    throw new Error("Invalid data format");
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setPageLoading(false); // Stop loading spinner
            }
        };

        fetchImages(); // Call the async function
    }, []);

    return (
        <>
            {pageLoading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
                </div>
            ) : (
                <Box sx={{ width: "100%", height: "auto", overflowY: "scroll", padding: 2 }}>
                    {itemData.length > 0 ? (
                        <ImageList variant="masonry" cols={3} gap={8}>
                            {itemData.map((img, index) => (
                                <ImageListItem key={index}>
                                    <Image
                                        src={img.url} // Use the image URL directly
                                        alt={`Image ${index + 1}`}
                                        width={248}
                                        height={248}
                                        layout="responsive"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    ) : (
                        <p className="text-center text-gray-500">No images available.</p>
                    )}
                </Box>
            )}
        </>
    );
}
