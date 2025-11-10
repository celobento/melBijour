"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { Buffer } from "buffer";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploadProps {
  userId: string;
  onImageChange: (url: string) => void;
  onImageUpdate?: (url: string) => Promise<void>;
  disabled?: boolean;
}

export function ImageUpload({
  userId,
  onImageChange,
  onImageUpdate,
  disabled,
}: ImageUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      toast.error("Arquivo deve ter menos de 5MB");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Apenas imagens JPEG, PNG e WebP são permitidas");
      return;
    }

    // Store the original file for upload (don't read it yet)
    setSelectedFile(file);

    // Create preview using URL.createObjectURL (doesn't consume the file)
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      const fileBuffer = Buffer.from(await selectedFile.arrayBuffer());
      const { data } = await axiosInstance.post("/uploads/image", {
        fileBase64: fileBuffer.toString("base64"),
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        userId,
        folder: "users",
      });

      if (!data?.url) {
        throw new Error("Upload failed");
      }

      onImageChange(data.url);

      // Update the user's image in the database
      if (onImageUpdate) {
        try {
          await onImageUpdate(data.url);
        } catch (error) {
          console.error("Error updating user image:", error);
          toast.error("Erro ao atualizar perfil");
          return;
        }
      }

      toast.success("Imagem atualizada com sucesso!");

      setIsOpen(false);
      setPreview(null);
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Erro ao fazer upload da imagem";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = () => {
    uploadImage();
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Clear state when dialog closes
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setSelectedFile(null);
      // Clear file inputs
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      <div className="flex items-center space-x-4">
        <Dialog open={isOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={disabled}>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Alterar Foto
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Alterar Foto do Perfil</DialogTitle>
              <DialogDescription>
                Escolha uma foto da galeria ou tire uma nova foto
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Preview */}
              {preview && (
                <div className="text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover mx-auto"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={openGallery}
                  disabled={isUploading}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Galeria
                </Button>

                <Button
                  variant="outline"
                  onClick={openCamera}
                  disabled={isUploading}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Câmera
                </Button>
              </div>

              {/* Upload Button */}
              {selectedFile && (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    "Confirmar Upload"
                  )}
                </Button>
              )}

              {/* Hidden File Inputs */}
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
