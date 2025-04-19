import { useState } from "react"
import { useImageStore } from "../../store/storeimage"
import { ButtonActions } from "./ButtonActions"
import { Separator } from "./Sepator"

export const Options = () => {
  const proceseed = useImageStore((state) => state.processed)
  const { file, setProcessed, processed } = useImageStore()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const handleConverterGrises = () => {
    if (!file) {
      console.warn("No hay archivo cargado")
      return
    }
    const formData = new FormData()
    formData.append("image", file)

    fetch("/upload", {
      method: "POST",
      body: formData,
    }).then(res => res.json())
      .then(data => {
        const processedImage = `data:image/png;base64,${data.processed_image}`;

        setProcessed(processedImage);
      })
      .catch(err => {
        console.error("error al enviar imagen", err)
      })

  }

  const handleResizeYEnviar = async () => {
    if (!file) return;
    if (width == 0 || height == 0) return

    const formData = new FormData();
    formData.append("image", file);
    formData.append("width", String(width));
    formData.append("height", String(height));

    try {
      const res = await fetch("/resize", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      const processedImage = `data:image/png;base64,${data.processed_image}`;
      setProcessed(processedImage);

    } catch (err) {
      console.error("Error al redimensionar o enviar la imagen", err);
    }
  }

  const handleRotate = async (direction: "left" | "right") => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("action", "rotate");
    formData.append("direction", direction);

    try {
      const res = await fetch("/rotate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const processedImage = `data:image/png;base64,${data.processed_image}`;
      setProcessed(processedImage);
    } catch (err) {
      console.error("Error al rotar imagen", err);
    }
  };

  const handleFlipHorizontal = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("action", "flip");

    try {
      const res = await fetch("/flip", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const processedImage = `data:image/png;base64,${data.processed_image}`;
      setProcessed(processedImage);
    } catch (err) {
      console.error("Error al voltear imagen", err);
    }
  };

  const downloadProcessedImage = (): void => {
    if (!processed) {
      console.warn("No hay imagen procesada para descargar");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = processed;
      link.download = `imagen-procesada-${Date.now()}.png`; // Nombre único
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
    }
  };
  return (
    <section
      className="col-span-3 col-start-1 w-full h-full 
      max-lg:col-span-2 max-lg:col-start-1 flex flex-col justify-center"
    >
      <div className="w-full h-full flex flex-col justify-around">
        <Separator title="Convertir Imagen Escala De Grises" />
        <div className="flex flex-row justify-center">
          <ButtonActions name="Grises" handleEventClick={handleConverterGrises} />
        </div>
        <Separator title="Redimensionar Imagen" />
        <div className=" flex flex-row gap-3 justify-center">
          <ButtonActions name="Redimensionar" handleEventClick={handleResizeYEnviar} />
          <input type="number" className="max-w-[80px] bg-white rounded-md border-white border-1 " onChange={(e) => setWidth(Number(e.target.value))} value={width} />
          <input type="number" className="max-w-[80px] bg-white rounded-md border-white border-1 " onChange={(e) => setHeight(Number(e.target.value))} value={height} />
        </div>
        <Separator title="Rotar Imagen" />
        <div className="flex flex-row justify-center gap-3">
          <ButtonActions name="Rotar Izquierda" handleEventClick={() => handleRotate("left")} />
          <ButtonActions name="Rotar Derecha" handleEventClick={() => handleRotate("right")} />
          <ButtonActions name="Espejo Horizontal" handleEventClick={() => handleFlipHorizontal()} />
        </div>
      </div>
      <div className="w-full h-full grid grid-cols-4">
        <div className="col-span-3 col-start-1 w-full h-auto flex flex-col justify-center p-2 border-2 border-dashed border-gray-50">
          {proceseed && <img className="" src={proceseed} alt="Procesada" />}
        </div>

        <div className="col-span-1 col-start-4 w-full h-full flex flex-col justify-around items-center">
          <ButtonActions name="GUARDAR" handleEventClick={downloadProcessedImage} />
          <ButtonActions name="Test" />
        </div>
      </div>
    </section>
  )
}

