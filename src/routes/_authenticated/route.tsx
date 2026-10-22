import { createFileRoute, isRedirect, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) throw redirect({ to: "/auth" });
      return { user: data.user };
    } catch (error) {
      if (isRedirect(error)) throw error;
      // Session check failed (network/proxy error): send visitor to /auth
      // instead of leaving a blank protected page.
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
