import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-slate-800 text-white p-4 flex justify-between">
    <Link to="/" className="font-bold text-xl">Dystalk</Link>
    <div className="space-x-4">
      <Link to="/about" className="hover:underline">About Us</Link>
      <Link to="/transcribe" className="hover:underline">Transcribe</Link>
    </div>
  </nav>
);

export default Navbar;
