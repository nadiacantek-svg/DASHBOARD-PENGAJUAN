import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "on-background": "#191c1d",
        "surface-container-high": "#e7e8e9",
        "on-tertiary": "#ffffff",
        "outline-variant": "#d7c4ac",
        "on-primary-fixed-variant": "#614000",
        "inverse-on-surface": "#f0f1f2",
        "secondary": "#5f5e5e",
        "on-secondary": "#ffffff",
        "on-primary-container": "#6a4700",
        "inverse-surface": "#2e3132",
        "primary-fixed": "#ffddaf",
        "surface-tint": "#805600",
        "secondary-fixed-dim": "#c8c6c5",
        "secondary-fixed": "#e4e2e1",
        "tertiary-container": "#c0bfbf",
        "surface-variant": "#e1e3e4",
        "on-primary-fixed": "#281800",
        "tertiary-fixed-dim": "#c7c6c6",
        "tertiary": "#5e5e5e",
        "on-tertiary-container": "#4d4e4e",
        "on-secondary-fixed-variant": "#474747",
        "surface-bright": "#f8f9fa",
        "primary": "#805600",
        "surface": "#f8f9fa",
        "on-primary": "#ffffff",
        "on-tertiary-fixed": "#1b1c1c",
        "outline": "#847560",
        "surface-dim": "#d9dadb",
        "surface-container-lowest": "#ffffff",
        "tertiary-fixed": "#e4e2e2",
        "on-error-container": "#93000a",
        "on-surface-variant": "#524533",
        "error": "#ba1a1a",
        "on-secondary-container": "#656464",
        "on-secondary-fixed": "#1b1c1c",
        "primary-container": "#ffb000",
        "surface-container-highest": "#e1e3e4",
        "on-surface": "#191c1d",
        "secondary-container": "#e4e2e1",
        "inverse-primary": "#ffba43",
        "surface-container-low": "#f3f4f5",
        "on-tertiary-fixed-variant": "#464747",
        "background": "#f8f9fa",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "primary-fixed-dim": "#ffba43",
        "surface-container": "#edeeef"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "sm": "12px",
        "gutter": "24px",
        "base": "8px",
        "xs": "4px",
        "margin-desktop": "64px",
        "lg": "48px",
        "xl": "80px",
        "margin-mobile": "16px",
        "md": "24px"
      },
      "fontFamily": {
        "display-lg": ["\"Source Serif 4\""],
        "label-lg": ["Hanken Grotesk"],
        "headline-md": ["\"Source Serif 4\""],
        "label-md": ["Hanken Grotesk"],
        "headline-lg-mobile": ["\"Source Serif 4\""],
        "headline-lg": ["\"Source Serif 4\""],
        "body-lg": ["Hanken Grotesk"],
        "body-md": ["Hanken Grotesk"]
      },
      "fontSize": {
        "display-lg": ["56px", { "lineHeight": "64px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "label-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "label-md": ["12px", { "lineHeight": "16px", "fontWeight": "500" }],
        "headline-lg-mobile": ["28px", { "lineHeight": "36px", "fontWeight": "600" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }]
      }
    }
  },
  plugins: [
    forms,
    containerQueries,
  ],
}
