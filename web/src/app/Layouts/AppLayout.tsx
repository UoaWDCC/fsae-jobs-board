import Navbar from "../components/Navbar/Navbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <Navbar />
        <main>{children}</main>
      </div>
    );
  }