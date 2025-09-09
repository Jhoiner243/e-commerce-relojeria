import { Suspense } from "react";
import Sections from "./sections";

const Navbar = () => {
  return (
    <div>
      <nav className="w-full flex items-center justify-between pb-4 mx-auto sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl py-4 justify-items-end">
        {/* LEFT */}
      </nav>
      <Suspense fallback={<div className="flex justify-center items-center p-3 border-b border-t border-gray-200 mt-2 w-full"><div className="text-sm text-gray-500">Loading...</div></div>}>
        <Sections />
      </Suspense>
    </div>
  );
};

export default Navbar;
