export const handleHours = (from: any, fromTime: any, to: any, toTime: any) => {
  const from_ = fromTime === "PM" ? +from + 12 : +from;
  const to_ = toTime === "PM" ? +to + 12 : +to;
  return Math.abs(to_ - from_) == 0 ? 24 : Math.abs(to_ - from_);
};
export const handleCreatedDate = (date_: Date) => {
  const date = new Date(date_);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear().toString().slice(-2);
  const formattedDate = `${hours}:${minutes} ${day}-${month}-20${year}`;
  return formattedDate;
};
async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new globalThis.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        width = maxWidth;
        height = maxHeight;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, { type: file.type });
                resolve(resizedFile);
              } else {
                reject(new Error("Failed to resize image."));
              }
            },
            file.type,
            0.9
          );
        } else {
          reject(new Error("Canvas context not available."));
        }
      };

      img.onerror = () => reject(new Error("Failed to load image."));
    };

    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}
export const ResizeImage = async (file: File, maxWidth: number, maxHeight: number) => {
  return { done: true, file: await resizeImage(file, maxWidth + 1, maxHeight + 1) };
};
