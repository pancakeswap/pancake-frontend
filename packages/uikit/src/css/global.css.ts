import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./vars.css";

globalStyle("body", {
  backgroundColor: vars.colors.background,
});
