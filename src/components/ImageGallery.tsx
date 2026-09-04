"use client";

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";

export type GalleryImage = {
  key: string;
  url: string;
  lastModified: string | null;
};

type ImageGalleryProps = {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
};

export default function ImageGallery({
  images,
  loading,
  error,
}: ImageGalleryProps) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (images.length === 0) {
    return (
      <Typography color="text.secondary">
        No images yet. Upload one to get started.
      </Typography>
    );
  }

  return (
    <ImageList cols={3} gap={12}>
      {images.map((image) => (
        <ImageListItem key={image.key}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.key}
            loading="lazy"
            style={{ width: "100%", height: 180, objectFit: "cover" }}
          />
          <ImageListItemBar
            title={image.key}
            subtitle={
              image.lastModified
                ? new Date(image.lastModified).toLocaleString()
                : undefined
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
