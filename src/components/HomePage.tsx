"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  Paper,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import UploadForm from "@/components/UploadForm";
import ImageGallery, { type GalleryImage } from "@/components/ImageGallery";

export default function HomePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/images");
      const data = (await response.json()) as {
        images?: GalleryImage[];
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load images");
      }
      setImages(data.images ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="h1">
            Image Upload
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Upload
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Images are stored in a private S3 bucket. The gallery uses
            short-lived signed URLs.
          </Typography>
          <UploadForm onUploaded={loadImages} />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Gallery
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <ImageGallery images={images} loading={loading} error={error} />
        </Paper>
      </Container>
    </Box>
  );
}
