"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ProductCategory,
  useCreateProduct,
  type CreateProductInput,
} from "@/hooks/use-products";
import axiosInstance from "@/lib/axios";
import {
  digitsToNumber,
  extractDigits,
  formatDigitsToBrl,
} from "@/lib/currencyInput";
import { Buffer } from "buffer";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProductDialog({
  open,
  onOpenChange,
}: AddProductDialogProps) {
  const { data: session } = useSession();
  const createProductMutation = useCreateProduct();
  const [formData, setFormData] = useState<CreateProductInput>({
    name: "",
    description: "",
    image: "",
    currentStock: 0,
    value: 0,
    productCategory: ProductCategory.NECKLACE,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [valueInput, setValueInput] = useState<string>("");

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
        image: "",
        currentStock: 0,
        value: 0,
        productCategory: ProductCategory.NECKLACE,
      });
      setValueInput("");
      setPreview(null);
      setSelectedFile(null);
      setIsImageModalOpen(false);
      // Clear file inputs
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  }, [open]);

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

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const uploadImage = async () => {
    if (!selectedFile || !session?.user?.id) return;
    setIsUploading(true);

    try {
      const fileBuffer = Buffer.from(await selectedFile.arrayBuffer());
      const { data } = await axiosInstance.post("/uploads/image", {
        fileBase64: fileBuffer.toString("base64"),
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        userId: session.user.id,
        folder: "products",
      });

      if (!data?.url) {
        throw new Error("Upload failed");
      }

      setFormData({ ...formData, image: data.url });
      toast.success("Imagem enviada com sucesso!");
      setIsUploading(false);
      setIsImageModalOpen(false);
      // Clear preview and file after successful upload
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setSelectedFile(null);
      // Clear file inputs
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    } catch (error: any) {
      setIsUploading(false);
      toast.error(
        error?.response?.data?.message || "Erro ao fazer upload da imagem"
      );
    }
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleImageModalClose = (isOpen: boolean) => {
    setIsImageModalOpen(isOpen);
    if (!isOpen) {
      // Clear state when modal closes without uploading
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Nome do produto é obrigatório");
      return;
    }

    if (formData.value <= 0) {
      toast.error("Valor deve ser maior que zero");
      return;
    }

    // Check if there's a selected file that hasn't been uploaded yet
    if (selectedFile && !formData.image) {
      toast.error("Por favor, confirme o upload da imagem antes de salvar");
      return;
    }

    try {
      const productData: CreateProductInput = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        image: formData.image || undefined,
        currentStock: formData.currentStock || 0,
        value: formData.value,
        productCategory: formData.productCategory,
      };

      await createProductMutation.mutateAsync(productData);
      toast.success("Produto criado com sucesso!");
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao criar produto";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os dados do produto abaixo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nome do produto"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productCategory">Categoria *</Label>
                <Select
                  value={formData.productCategory}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      productCategory: value as ProductCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProductCategory.NECKLACE}>
                      Colar
                    </SelectItem>
                    <SelectItem value={ProductCategory.EARRING}>
                      Brinco
                    </SelectItem>
                    <SelectItem value={ProductCategory.BRACELET}>
                      Pulseira
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição do produto"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem do Produto</Label>
              <div className="flex flex-col gap-4">
                {/* Current Image Display */}
                {formData.image && (
                  <div className="relative w-full h-48 border rounded-md overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image: "" });
                        if (preview && preview.startsWith("blob:")) {
                          URL.revokeObjectURL(preview);
                        }
                        setPreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Image Selection Dialog */}
                <Dialog
                  open={isImageModalOpen}
                  onOpenChange={handleImageModalClose}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
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
                      {formData.image ? "Alterar Imagem" : "Selecionar Imagem"}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Imagem do Produto</DialogTitle>
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
                            className="w-32 h-32 object-cover rounded-lg mx-auto border border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
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
                          type="button"
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
                          type="button"
                          onClick={uploadImage}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valor (R$) *</Label>
                <Input
                  id="value"
                  type="text"
                  value={valueInput}
                  onChange={(e) => {
                    const input = e.target.value;
                    const digits = extractDigits(input);

                    if (digits === "") {
                      setValueInput("");
                      setFormData({
                        ...formData,
                        value: 0,
                      });
                      return;
                    }

                    const formatted = formatDigitsToBrl(digits);
                    const numValue = digitsToNumber(digits);

                    setValueInput(formatted);
                    setFormData({
                      ...formData,
                      value: numValue,
                    });
                  }}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentStock">Estoque</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  value={formData.currentStock ?? 0}
                  onChange={(e) => {
                    const val =
                      e.target.value === "" ? 0 : parseInt(e.target.value);
                    setFormData({
                      ...formData,
                      currentStock: isNaN(val) ? 0 : val,
                    });
                  }}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full gap-2 border-t pt-4">
              <Button
                className="w-1/2"
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createProductMutation.isPending || isUploading}
              >
                Cancelar
              </Button>
              <Button
                className="w-1/2"
                type="submit"
                disabled={createProductMutation.isPending || isUploading}
              >
                {createProductMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
