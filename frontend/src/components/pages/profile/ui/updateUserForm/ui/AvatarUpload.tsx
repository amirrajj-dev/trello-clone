import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";
import { getRandomColor } from "@/helpers/get-random-color";

const AvatarUpload = ({
  avatarPreview,
  setAvatarPreview,
  setAvatarFile,
  currentUser,
}: {
  avatarPreview: string;
  setAvatarPreview: (value: string) => void;
  avatarFile: File | null;
  setAvatarFile: (value: File | null) => void;
  currentUser: { id: string; name: string } | undefined;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center space-y-4"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-base-content mb-2">
        <Camera size={16} className="text-primary" />
        Profile Picture
      </label>
      <div className="relative group">
        <div className="size-16 rounded-full border-2 border-base-300 overflow-hidden bg-base-200">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Profile preview"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`size-16 ${getRandomColor(
                currentUser?.id as string
              )} flex items-center justify-center`}
            >
              {getUserInitials(currentUser?.name as string)}
            </div>
          )}
        </div>
        <motion.div
          className="absolute inset-0 bg-base-content/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera size={24} className="text-base-100" />
        </motion.div>
        <AnimatePresence>
          {avatarPreview && (
            <motion.button
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemoveAvatar}
              className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-content rounded-full flex items-center justify-center text-xs"
            >
              <X size={12} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
      <p className="text-xs text-base-content/60 text-center">
        Click on the image to upload a new photo
        <br />
        Max size: 5MB • JPG, PNG, GIF
      </p>
    </motion.div>
  );
};

export default AvatarUpload;