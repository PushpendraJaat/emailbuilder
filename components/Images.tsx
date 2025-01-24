"use client";

import useSWR from 'swr';
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Image from "next/image";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then(res => res.json());

export default function Images() {
    const { data, error, isLoading } = useSWR<{ 
        success: boolean;
        files: { url: string }[] 
    }>('/api/getImages', fetcher);

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 p-8">
                    Failed to load images: {error.message}
                </div>
            ) : (
                <Box sx={{ width: "100%", height: "auto", overflowY: "scroll", padding: 2 }}>
                    {data?.files?.length ? (
                        <ImageList variant="masonry" cols={3} gap={8}>
                            {data.files.map((img, index) => (
                                <ImageListItem key={index}>
                                    <Image
                                        src={img.url}
                                        alt={`Image ${index + 1}`}
                                        width={248}
                                        height={248}
                                        layout="responsive"
                                        loading="lazy"
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