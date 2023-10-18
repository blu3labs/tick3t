import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import "../index.css";

function UploadFile({ image, setImage }) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    const fileExtension = acceptedFiles[0]?.name
      ?.split(".")
      ?.pop()
      .toLowerCase();

    if (
      fileExtension !== "jpeg" &&
      fileExtension !== "png" &&
      fileExtension !== "jpg" &&
      fileExtension !== "webp" &&
      fileExtension !== "gif" &&
      fileExtension !== "svg" &&
      fileExtension !== "apng" &&
      fileExtension !== "avif" &&
      fileExtension !== "bmp" &&
      fileExtension !== "ico" &&
      fileExtension !== "tiff"
    ) {
      toast.error("Please upload a valid image.");
      return;
    }
    setIsUploading(true);
    const fileSizeInBytes = acceptedFiles[0]?.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMB > 50) {
      toast.error("Please upload a logo smaller than 50MB.");
      return;
    }

    setImage(acceptedFiles[0]);


    const reader = new FileReader();
    reader.readAsDataURL(acceptedFiles[0]);

    setIsUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
    accept:
      "image/jpeg,image/png,image/jpg, image/webp,image/gif,image/svg+xml,image/apng,image/avif,image/bmp,image/ico,image/tiff",
    maxFiles: 1,
  });


  return (
    <div {...getRootProps()} className="createPreviewImage">
      <input {...getInputProps()} />
      {image ? (
        <div className="createPreviewLogoActive">
          <img src={
            typeof image === "string" ? image : URL.createObjectURL(image)
          } alt="image" draggable="false" />
        </div>
      ) : (
        <div className="upload-message">
          {isUploading ? (
            <p>Loading...</p>
          ) : (
            <>
              {isDragActive ? (
                <div className="createPreviewLogoBox">
                  <span>Drop the files here...</span>
                </div>
              ) : (
                <div className="createPreviewLogoBox">
                  <FaCloudUploadAlt className="createPreviewLogoBoxIcon" />
                  <span>Please upload a image</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadFile;
