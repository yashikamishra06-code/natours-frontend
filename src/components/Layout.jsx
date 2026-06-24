import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />

      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Layout;