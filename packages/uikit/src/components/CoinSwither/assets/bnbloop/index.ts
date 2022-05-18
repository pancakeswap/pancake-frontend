import { importAll } from "../../utils";

const images = importAll(require.context("./", false, /\.(png|jpe?g|svg)$/));

export default images;
