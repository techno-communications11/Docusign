import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useMyContext() {
  return useContext(AuthContext);
}
