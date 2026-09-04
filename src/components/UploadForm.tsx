"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type UploadFormProps = {
  onUploaded: () => void;
};

export default function UploadForm({ onUploaded }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Choose an image first");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = (await response.json()) as { key?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      setSuccess(`Uploaded as ${data.key}`);
      setFile(null);
      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
        >
          {file ? file.name : "Select image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            hidden
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setError(null);
              setSuccess(null);
            }}
          />
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={!file || uploading}
        >
          Upload
        </Button>

        {uploading && <LinearProgress />}

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Typography variant="caption" color="text.secondary">
          JPEG, PNG, GIF, or WebP · max 5 MB
        </Typography>
      </Stack>
    </Box>
  );
}
