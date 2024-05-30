import { usePromptContext } from "./PromptContext";

export const usePrompt = () => {
  const { prompt } = usePromptContext();

  return prompt;
};
