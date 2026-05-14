import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeState = {
  mode: "light" | "dark";
};

const storedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
const initialState: ThemeState = {
  mode: storedTheme || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.mode === "light" ? "dark" : "light";
      state.mode = newTheme;
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.mode = action.payload;
      document.documentElement.setAttribute("data-theme", action.payload);
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
