"use client";

import React from "react";

import JoinForm from "@/components/forms/JoinForm";

export default function JoinPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <JoinForm />
    </div>
  );
}
