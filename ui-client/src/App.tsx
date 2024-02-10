import { Footer } from './components/Footer';
import { Messages } from './components/Messages';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <main className="dark h-screen flex flex-col text-foreground bg-background">
      <Navbar />
      <div className="flex flex-col justify-between items-center flex-1 p-6 max-w-5xl mx-auto w-full">
        <div>big hero section</div>
        <Messages />
        <div>form to add more</div>
      </div>
      <Footer />
    </main>
  );
}

export default App;
