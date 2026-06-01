import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/store/auth-store";

/**
 * Shared sign-out handler: clears the session, toasts, and redirects to /login.
 * Used by the sidebar, mobile drawer and settings so behavior stays consistent.
 */
export function useLogout() {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return async () => {
    await signOut();
    toast({ title: "Signed out", variant: "success" });
    navigate("/login", { replace: true });
  };
}
