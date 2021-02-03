import React, { useState } from "react";
import { sample } from "lodash";
import { alertVariants } from "../../components/Alert";
import Button from "../../components/Button/Button";
import ToastContainer from "./ToastContainer";

export default {
  title: "Widgets/Toast",
  component: ToastContainer,
  argTypes: {},
};

export const Default: React.FC = () => {
  const [toasts, setToasts] = useState([]);

  const handleClick = (description = "") => {
    const now = Date.now();
    const randomToast = {
      id: `id-${now}`,
      title: `Title: ${now}`,
      description,
      type: alertVariants[sample(Object.keys(alertVariants))],
    };

    setToasts((prevToasts) => [randomToast, ...prevToasts]);
  };

  const handleRemove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id));
  };

  return (
    <div>
      <Button type="button" variant="secondary" onClick={() => handleClick()}>
        Random Toast
      </Button>
      <Button
        type="button"
        variant="secondary"
        ml="8px"
        onClick={() => handleClick("This is a description to explain more about the toast")}
      >
        Random Toast with Description
      </Button>
      <ToastContainer toasts={toasts} onRemove={handleRemove} />
    </div>
  );
};

export const WithAction: React.FC = () => {
  const [toasts, setToasts] = useState([]);

  const handleClick = () => {
    const now = Date.now();
    const randomToast = {
      id: `id-${now}`,
      title: `Title: ${now}`,
      description: "A description of a toast with a call to action",
      action: {
        text: "Action Button",
        url: "https://pancakeswap.finance",
      },
      type: alertVariants[sample(Object.keys(alertVariants))],
    };

    setToasts((prevToasts) => [randomToast, ...prevToasts]);
  };

  const handleRemove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id));
  };

  return (
    <div>
      <Button type="button" variant="success" ml="8px" onClick={() => handleClick()}>
        Random Toast with Action Button
      </Button>
      <ToastContainer toasts={toasts} onRemove={handleRemove} />
    </div>
  );
};
