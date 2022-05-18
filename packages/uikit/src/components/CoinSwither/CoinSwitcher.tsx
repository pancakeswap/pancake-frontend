import { useRef, useEffect, useCallback } from "react";

let coinInterval: NodeJS.Timeout;
let coinAnimationFrame = false;

interface SequencePlayerProps {
  images: string[];
  msPerFrame?: number;
}

export const SequencePlayer: React.FC<SequencePlayerProps> = ({ images, msPerFrame = 32 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagePreloadProgress = useRef<number>(0);
  const imagePreload = useRef<HTMLImageElement[]>([]);
  const coinImagePlayProgress = useRef<number>(0);

  const stopCoinLooper = useCallback(() => {
    clearInterval(coinInterval);
  }, []);

  const coinDrawer = useCallback(() => {
    coinAnimationFrame = false;
    if (canvasRef.current) {
      const { width, height } = canvasRef.current;
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(imagePreload.current[coinImagePlayProgress.current], 0, 0);
        coinImagePlayProgress.current++;
        if (coinImagePlayProgress.current >= images.length) {
          coinImagePlayProgress.current = 0;
          stopCoinLooper();
        }
      }
    }
  }, [stopCoinLooper, images.length]);

  const coinLooper = useCallback(() => {
    coinInterval = setInterval(() => {
      if (coinAnimationFrame) {
        return;
      }
      coinAnimationFrame = true;
      requestAnimationFrame(coinDrawer);
    }, msPerFrame);
  }, [coinDrawer, msPerFrame]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const img = new Image();
    img.onload = () => {
      if (ctx && canvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        canvasRef.current.style.marginTop = `-${img.height / 3}px`;
        canvasRef.current.style.marginLeft = `-${img.width / 3}px`;
        const scale = 500 / canvasRef.current.width;
        canvasRef.current.style.transform = `scale(${scale})`;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = images[0];
    images.forEach((d, index) => {
      const preLoadImg = new Image();
      preLoadImg.src = d;
      preLoadImg.onload = () => {
        imagePreloadProgress.current += 1;
        imagePreload.current[index] = preLoadImg;
        if (images.length === imagePreloadProgress.current) {
          // ready
        }
      };
    });
    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(coinInterval);
    };
  }, [images]);

  return <canvas ref={canvasRef} onClick={() => coinLooper()} />;
};
