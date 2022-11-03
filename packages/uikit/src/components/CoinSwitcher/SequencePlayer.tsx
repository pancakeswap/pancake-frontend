import { useRef, useEffect, useCallback } from "react";

let coinInterval: NodeJS.Timeout;

interface SequencePlayerProps {
  images: string[];
  msPerFrame?: number;
  onPlayStart?: () => void;
  onPlayFinish?: () => void;
}

export const SequencePlayer: React.FC<React.PropsWithChildren<SequencePlayerProps>> = ({
  images,
  msPerFrame = 32,
  onPlayFinish,
  onPlayStart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagePreloadProgress = useRef<number>(0);
  const imagePreload = useRef<HTMLImageElement[]>([]);
  const coinImagePlayProgress = useRef<number>(0);
  const isPlaying = useRef<boolean>(false);

  const stopCoinLooper = useCallback(() => {
    clearInterval(coinInterval);
  }, []);

  const coinDrawer = useCallback(() => {
    if (canvasRef.current) {
      const { width, height } = canvasRef.current;
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(imagePreload.current[coinImagePlayProgress.current], 0, 0);
        coinImagePlayProgress.current++;
        if (coinImagePlayProgress.current >= images.length) {
          // set the frame back to default frame 0
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(imagePreload.current[0], 0, 0);
          coinImagePlayProgress.current = 0;
          stopCoinLooper();
          isPlaying.current = false;
          if (onPlayFinish) onPlayFinish();
        }
      }
    }
  }, [stopCoinLooper, images.length, onPlayFinish]);

  const coinLooper = useCallback(() => {
    if (isPlaying.current) return;
    if (onPlayStart) onPlayStart();
    coinInterval = setInterval(() => {
      isPlaying.current = true;
      requestAnimationFrame(coinDrawer);
    }, msPerFrame) as unknown as NodeJS.Timeout;
  }, [coinDrawer, msPerFrame, onPlayStart]);

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const ctx = canvasRef.current.getContext("2d");
    const img = new Image();
    img.onload = () => {
      if (ctx && canvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        canvasRef.current.style.marginTop = `-${img.height / 2.07}px`;
        canvasRef.current.style.marginLeft = `-${img.width / 2.4}px`;
        const scale = 300 / canvasRef.current.width;
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
    return () => {
      clearInterval(coinInterval);
    };
  }, [images]);

  return (
    <canvas
      ref={canvasRef}
      onClick={(e) => {
        e.stopPropagation();
        coinLooper();
      }}
    />
  );
};
