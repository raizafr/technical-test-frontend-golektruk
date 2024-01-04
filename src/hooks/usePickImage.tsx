import { useState } from "react"

export interface PickImageReturnType {
    onSelectFile: (e: any) => void;
    fileImage: File|null;
    preview: string;
    setPreview: React.Dispatch<React.SetStateAction<string>>;
    onReset: () => void;
}

function usePickImage(): PickImageReturnType {
    const [fileImage, setFileImage] = useState<File|null>(null);
    const [preview, setPreview] = useState<string>("");

    function onSelectFile(e: any) {
        setPreview(URL.createObjectURL(e.target.files[0]));
        setFileImage(e.target.files[0]);
    }

    function onReset() {
        setPreview('')
        setFileImage(null)
    }

    return {
        fileImage,
        preview,
        setPreview,
        onSelectFile,
        onReset,
    };
}

export default usePickImage;