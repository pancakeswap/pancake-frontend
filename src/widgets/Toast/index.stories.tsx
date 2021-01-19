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
  const [alerts, setAlerts] = useState([]);

  const handleClick = (description = "") => {
    const now = Date.now();
    const randomAlert = {
      id: `id-${now}`,
      title: `Title: ${now}`,
      description,
      type: alertVariants[sample(Object.keys(alertVariants))],
    };

    setAlerts((prevAlerts) => [randomAlert, ...prevAlerts]);
  };

  const handleRemove = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((prevAlert) => prevAlert.id !== id));
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
        onClick={() => handleClick("This is a description to explain more about the alert")}
      >
        Random Toast with Description
      </Button>
      <ToastContainer alerts={alerts} onRemove={handleRemove} />
    </div>
  );
};
