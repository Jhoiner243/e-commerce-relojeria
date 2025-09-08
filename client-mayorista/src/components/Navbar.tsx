import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import Sections from "./sections";

const Navbar = () => {
  return (
    <div>

    <nav className="w-full flex items-center justify-between pb-4 mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl py-4">
      {/* LEFT */}
      <Link href="/" className="flex items-center">
        <Image src="/logo.png" alt="guaca" width={36} height={36} />
        <p className="hidden md:block text-md font-medium tracking-wider ml-2">
          La guaca del reloj
        </p>
      </Link>
      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <SearchBar />
        <Link href="/">
          <Home className="w-4 h-4 text-gray-600"/>
        </Link>
        
      </div>
    </nav>
      <Sections />
    </div>

  );
};

export default Navbar;
