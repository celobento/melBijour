"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrencyBr } from "@/lib/formatCurrencyBr";
import { generatePixCode, isValidPixKey } from "@/lib/pix-generator";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  totalPrice: number;
  pixKey: string;
  companyName?: string;
  city?: string;
}

export function PixPaymentModal({
  isOpen,
  onClose,
  bookingId,
  totalPrice,
  pixKey,
  companyName = process.env.APP_NAME || "Mel Bijour",
  city = "Fortaleza",
}: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [isValidKey, setIsValidKey] = useState(true);

  // Validate PIX key
  useEffect(() => {
    setIsValidKey(isValidPixKey(pixKey));
  }, [pixKey]);

  // Generate proper PIX EMV QR Code
  const pixCode = isValidKey
    ? generatePixCode({
        pixKey,
        amount: totalPrice,
        merchantName: process.env.APP_NAME || "Mel Bijour",
        merchantCity: city || "Fortaleza",
        description: `${bookingId.toString().slice(0, 25)}`,
      })
    : "";

  // Generate QR code
  useEffect(() => {
    if (pixCode && isOpen) {
      QRCode.toDataURL(
        pixCode,
        { width: 200 },
        (err: Error | null | undefined, url: string) => {
          if (err) {
            console.error("Error generating QR code:", err);
            toast.error("Erro ao gerar QR Code");
          } else {
            setQrCodeDataUrl(url);
          }
        }
      );
    }
  }, [pixCode, isOpen]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar código PIX");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pagamento via PIX</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code ou copie o código PIX para efetuar o pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Message for Invalid PIX Key */}
          {!isValidKey && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              <p className="font-medium">Chave PIX inválida</p>
              <p className="text-sm">
                Configure uma chave PIX válida nas configurações do sistema.
              </p>
            </div>
          )}

          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="PIX QR Code"
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Escaneie com seu app de pagamento
            </p>
          </div>

          {/* Copy-Paste Code */}
          <div className="space-y-2">
            <Label htmlFor="pixCode">Código PIX (Copia e Cola)</Label>
            <div className="flex gap-2">
              <Input
                id="pixCode"
                value={pixCode}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                disabled={copied || !isValidKey}
              >
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Valor:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrencyBr(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-600">Chave PIX:</span>
              <span className="text-sm font-mono">{pixKey}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fechar
            </Button>
            <Button
              onClick={copyToClipboard}
              className="flex-1"
              disabled={copied || !isValidKey}
            >
              {copied ? "Copiado!" : "Copiar Código PIX"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
