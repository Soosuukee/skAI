"use client";

import React, { useState } from "react";
import { Button } from "@/once-ui/components";
import { LoginForm } from "./LoginForm";
import { useAuth } from "@/app/contexts/AuthContext";

export function LoginButton() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { user } = useAuth();

  if (user) {
    return null; // L'utilisateur est déjà connecté, ne pas afficher le bouton
  }

  return (
    <>
      <Button variant="primary" onClick={() => setShowLoginForm(true)}>
        Se connecter
      </Button>

      {showLoginForm && <LoginForm onClose={() => setShowLoginForm(false)} />}
    </>
  );
}
