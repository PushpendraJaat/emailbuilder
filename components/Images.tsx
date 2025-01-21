"use client";

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function Images() {
    const [pageLoading, setPageLoading] = useState(true);
    const [itemData, setItemData] = useState([]); // Initialize as an empty array

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/getImages');
                if (!response.ok) throw new Error('Failed to fetch images');

                const data = await response.json(); // Parse the response as JSON
                console.log(data);
                
                if (data.success && Array.isArray(data.files)) {
                    setItemData(data.files); // Assume `files` contains the array of image URLs
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchImages();
    }, []);

    return (
        <>
            {pageLoading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
                </div>
            ) : (
                <Box sx={{ width: 500, height: 450, overflowY: 'scroll' }}>
                    <ImageList variant="masonry" cols={3} gap={8}>
                        {itemData.map((imgUrl, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={`http://localhost:3000/uploads/${imgUrl}`}
                                    srcSet={`${imgUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    alt={`Image ${index + 1}`}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            )}
        </>
    );
}
