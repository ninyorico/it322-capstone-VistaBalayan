import { Toaster } from "sonner";
import { RouterProvider } from "react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}