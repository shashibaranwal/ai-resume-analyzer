import React from 'react';
import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar sticky top-0 z-30">
            <div className="navbar-inner">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white text-sm font-semibold">
                        R
                    </span>
                    <span className="text-base font-semibold tracking-tight text-ink-900">
                        Resume Analyzer
                    </span>
                </Link>

                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>
            </div>
        </nav>
    )
}

export default Navbar;
