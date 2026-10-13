export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-border bg-background border-t py-4 px-6">
      <div className="flex justify-center items-center gap-6 text-muted-foreground text-sm">
        <span>© {new Date().getFullYear()} Voxora. All rights reserved.</span>
      </div>
    </footer>
  );
}
