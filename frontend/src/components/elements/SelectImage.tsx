import { useState } from "react";
import { UploadImage } from "./UploadImage";
import { AddImage } from "./AddImage";
import { useImageStore } from "../../store/storeimage";

export const SelectImage = () => {

  const [preview, setPreview] = useState<string | null>(null);
  const { setFile } = useImageStore()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return
    }

    const reader = new FileReader();
    reader.onloadend = () => {

      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file)

    setFile(file)

  };
  return (
    <div
      className="col-span-3 col-start-4 w-full h-full flex justify-center items-center p-4
      max-lg:col-span-4 max-lg:col-start-3
      max-md:col-start-auto max-md:col-span-full"
    >
      <div
        className="border-2 border-dashed border-gray-50 w-full h-full flex flex-col
        justify-around items-center"
      >
        {preview ? (
          <>
            <AddImage setPreview={setPreview} />
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-5/6 h-auto rounded-b-xl"
            />
          </>

        ) : (
          <UploadImage
            handleFileChange={handleFileChange}
          />
        )}
      </div>

    </div>
  );
};




