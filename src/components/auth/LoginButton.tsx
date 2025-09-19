"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/once-ui/components";
import { LoginForm } from "@/components/forms/LoginForm";
import { useAuth } from "@/app/contexts/AuthContext";
import { usePathname } from "next/navigation";

export function LoginButton() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  // Ne jamais afficher sur la page /join
  const isJoinRoute = pathname === "/join";

  // Si on navigue vers /join alors qu'une modale est ouverte, la fermer
  useEffect(() => {
    if (isJoinRoute && showLoginForm) {
      setShowLoginForm(false);
    }
  }, [isJoinRoute, showLoginForm]);

  if (user) {
    return null; // L'utilisateur est déjà connecté, ne pas afficher le bouton
  }

  return isJoinRoute ? null : (
    <>
      <Button variant="primary" onClick={() => setShowLoginForm(true)}>
        Se connecter
      </Button>

      {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
    </>
  );
}
