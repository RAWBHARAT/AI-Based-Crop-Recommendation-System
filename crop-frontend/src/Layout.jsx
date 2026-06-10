import Sidebar from "./components/Sidebar";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔹 Sidebar */}
      <Sidebar />

      {/* 🔹 Page Content */}
      <div className="flex-1 p-8">
        {children}
      </div>

    </div>
  );
}

export default Layout;