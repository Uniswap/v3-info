import { createAction } from "@reduxjs/toolkit";

export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>(
  "user/updateMatchesDarkMode"
);
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>(
  "user/updateUserDarkMode"
);
