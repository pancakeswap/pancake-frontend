import { useDialogContext } from "./DialogContext";

export const usePrompt = () => {
  const { prompt } = useDialogContext();

  return prompt;
};
