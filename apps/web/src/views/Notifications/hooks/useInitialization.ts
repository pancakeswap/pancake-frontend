import { useEffect, useState } from "react";
import {
  createAuthClient,
  createPushClient,
  createSignClient,
} from "../utils/clients";

export default function useInitialization() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      try {
      //   await createSignClient();
      //   await createPushClient();
      //   await createAuthClient();
        setInitialized(true);
      } catch (err: unknown) {
        alert(err);
      }
    }
    if (!initialized) {
      init();
    }
  }, [initialized]);

  return {
    initialized,
  };
}
