
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";

interface ImageUploadProps {
  bucketName: string;
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  bucketName,
  onImageUploaded,
  currentImageUrl,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo");
      return;
    }

    try {
      setIsUploading(true);
      
      // Create a unique file name using timestamp and original name
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Set preview and call the onImageUploaded callback
      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);
      
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    onImageUploaded("");
  };

  return (
    <div className={`${className} space-y-2`}>
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
              e.currentTarget.classList.add("p-6");
            }}
          />
          <button 
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 transition-colors"
            aria-label="Supprimer l'image"
          >
            <XCircle size={20} />
          </button>
        </div>
      ) : (
        <div className="w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center bg-muted/30 p-4">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <LoadingSpinner />
              <span className="text-sm text-muted-foreground">Téléchargement en cours...</span>
            </div>
          ) : (
            <>
              <Image className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Cliquez pour télécharger une image<br/>
                <span className="text-xs">(JPG, PNG, max 2 Mo)</span>
              </p>
            </>
          )}
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        className="w-full"
        onClick={() => document.getElementById(`file-upload-${bucketName}`)?.click()}
      >
        {isUploading ? (
          <LoadingSpinner size="sm" className="mr-2" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {previewUrl ? "Changer l'image" : "Télécharger une image"}
      </Button>
      <input
        id={`file-upload-${bucketName}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUpload;
