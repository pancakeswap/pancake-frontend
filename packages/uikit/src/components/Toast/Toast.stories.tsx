import { Meta, StoryObj } from "@storybook/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { ToastsProvider, useToast } from "../../contexts";
import { Button } from "../Button";
import { FlexGap } from "../Layouts";
import { Toast } from "./Toast";

export default {
  title: "Components/Toast",
  component: Toast,
} satisfies Meta;

type Story = StoryObj;

function HookedToast() {
  const { toastInfo, toastError, toastSuccess, toastWarning } = useToast();
  return (
    <FlexGap gap="12px">
      <Button
        onClick={() =>
          toastInfo(
            "Info",
            "This is a description This is a description This is a description This is a description This is a description This is a description This is a description"
          )
        }
      >
        Info
      </Button>
      <Button onClick={() => toastSuccess("Success", "This is a description")}>Success</Button>
      <Button onClick={() => toastWarning("Warning", "This is a description")}>Warning</Button>
      <Button onClick={() => toastError("Danger", "This is a description")}>Error</Button>
    </FlexGap>
  );
}

export const Default: Story = {
  render: () => {
    return (
      <ToastsProvider>
        <HookedToast />
      </ToastsProvider>
    );
  },
};
