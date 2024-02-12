import { Outlet } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';

function Layout() {
  return (
    <main className="h-screen flex flex-col text-foreground overflow-scroll dark:bg-gradient-to-tl dark:from-gray-900 dark:bg-background bg-gradient-to-r from-blue-600 to-violet-600">
      <Navbar />
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

export default Layout;
