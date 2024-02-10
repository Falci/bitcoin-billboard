import { Outlet } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';

function Layout() {
  return (
    <main className="dark h-screen flex flex-col text-foreground bg-background  overflow-scroll">
      <Navbar />
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

export default Layout;
