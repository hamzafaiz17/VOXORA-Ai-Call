import type { ReactNode } from "react";

import { BrandLogo } from "@/components/BrandLogo";

export function AuthShell({
  children,
  enterpriseSlot,
}: {
  children: ReactNode;
  enterpriseSlot?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-background p-6 sm:p-10 md:px-16 md:py-10">
      {/* Top Header Bar */}
      <header className="flex w-full items-center justify-between">
        <BrandLogo className="h-7" />
        {enterpriseSlot && (
          <div>
            {enterpriseSlot}
          </div>
        )}
      </header>

      {/* Main Center Form */}
      <main className="mx-auto my-auto w-full max-w-[400px] py-8">
        {children}
      </main>

      {/* Bottom Spacer */}
      <footer className="h-6 w-full" />
    </div>
  );
}

