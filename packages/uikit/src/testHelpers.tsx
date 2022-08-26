import React, { ReactNode } from "react";
import { render, RenderResult } from "@testing-library/react";
import { light } from "./theme";
import { UIKitProvider } from "./Providers";

/* eslint-disable import/prefer-default-export */
export const renderWithProvider = (component: ReactNode, theme = light): RenderResult => {
  return render(<UIKitProvider theme={theme}>{component}</UIKitProvider>);
};

export const setupMockIntersectionObserver = (): void => {
  /* eslint-disable class-methods-use-this */
  class MockIntersectionObserver {
    readonly root: Element | null;

    readonly rootMargin: string;

    readonly thresholds: ReadonlyArray<number>;

    constructor() {
      this.root = null;
      this.rootMargin = "";
      this.thresholds = [];
    }

    disconnect() {
      return jest.fn;
    }

    observe() {
      return jest.fn;
    }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    unobserve() {
      return jest.fn;
    }
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
};
