export interface PickedImage {
  name: string;
  dataUrl: string;
}

/** Use Electron's native picker, with a browser fallback for the Vite preview. */
export async function pickImage(): Promise<PickedImage | null> {
  if (window.sitebuilder?.pickImage) return window.sitebuilder.pickImage();

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) {
        input.remove();
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        input.remove();
        resolve({ name: file.name, dataUrl: String(reader.result ?? '') });
      });
      reader.addEventListener('error', () => {
        input.remove();
        resolve(null);
      });
      reader.readAsDataURL(file);
    });
    input.addEventListener('cancel', () => {
      input.remove();
      resolve(null);
    });
    document.body.appendChild(input);
    input.click();
  });
}
