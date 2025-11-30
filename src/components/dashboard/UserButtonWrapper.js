"use client";

import { UserButton } from "@clerk/nextjs";

export function UserButtonWrapper() {
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "w-10 h-10",
        },
      }}
    />
  );
}

