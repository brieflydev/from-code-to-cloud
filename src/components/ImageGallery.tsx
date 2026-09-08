"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";

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

async function downloadImage(image: GalleryImage) {
  const response = await fetch(image.url);
  if (!response.ok) {
    throw new Error("Download failed");
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = image.key;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export default function ImageGallery({
  images,
  loading,
  error,
}: ImageGalleryProps) {
  const [preview, setPreview] = useState<GalleryImage | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

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
    <>
      {downloadError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setDownloadError(null)}
        >
          {downloadError}
        </Alert>
      )}

      <ImageList cols={3} gap={12}>
        {images.map((image) => (
          <ImageListItem key={image.key}>
            <Box
              component="button"
              type="button"
              onClick={() => setPreview(image)}
              aria-label={`Open ${image.key}`}
              sx={{
                display: "block",
                width: "100%",
                p: 0,
                border: 0,
                cursor: "pointer",
                background: "none",
                lineHeight: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.key}
                loading="lazy"
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />
            </Box>
            <ImageListItemBar
              title={image.key}
              subtitle={
                image.lastModified
                  ? new Date(image.lastModified).toLocaleString()
                  : undefined
              }
              actionIcon={
                <Box sx={{ display: "flex", pr: 0.5 }}>
                  <Tooltip title="View full image">
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                      aria-label={`View ${image.key}`}
                      onClick={() => setPreview(image)}
                    >
                      <OpenInFullIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.9)" }}
                      aria-label={`Download ${image.key}`}
                      onClick={async (event) => {
                        event.stopPropagation();
                        try {
                          setDownloadError(null);
                          await downloadImage(image);
                        } catch {
                          setDownloadError(`Could not download ${image.key}`);
                        }
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Dialog
        open={preview !== null}
        onClose={() => setPreview(null)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          backdrop: {
            sx: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
          },
        }}
      >
        {preview && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                pr: 1,
              }}
            >
              <Typography component="span" noWrap title={preview.key}>
                {preview.key}
              </Typography>
              <Box sx={{ display: "flex", flexShrink: 0 }}>
                <Tooltip title="Download">
                  <IconButton
                    aria-label="Download image"
                    onClick={async () => {
                      try {
                        setDownloadError(null);
                        await downloadImage(preview);
                      } catch {
                        setDownloadError(`Could not download ${preview.key}`);
                      }
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <IconButton
                  aria-label="Close"
                  onClick={() => setPreview(null)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                display: "flex",
                justifyContent: "center",
                bgcolor: "grey.900",
                p: 2,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt={preview.key}
                style={{
                  maxWidth: "100%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                }}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
