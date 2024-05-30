module.exports = {
  rules: {
    "no-restricted-imports": [
      "warn",
      {
        paths: [
          {
            name: "next/navigation",
            message: "Please use next/router instead of next/navigation",
          },
          {
            name: "next/image",
            message: "Please use image or figure instead of next/image",
          },
        ],
      },
    ],
  },
};
