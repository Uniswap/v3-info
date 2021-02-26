import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { parse } from "qs";
import { AppDispatch } from "../state";

export default function DarkModeQueryParamReader({
  location: { search },
}: RouteComponentProps): null {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!search) return;
    if (search.length < 2) return;

    const parsed = parse(search, {
      parseArrays: false,
      ignoreQueryPrefix: true,
    });

    const theme = parsed.theme;

    if (typeof theme !== "string") return;
  }, [dispatch, search]);

  return null;
}
