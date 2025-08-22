import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Briefcase, LogIn, LogOut, PlusCircle, User2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, auth, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <nav className="container mx-auto flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">
            PlacementEmpire
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              isActive
                ? "text-white"
                : "text-white/70 hover:text-white transition"
            }
          >
            Jobs
          </NavLink>
          {isAuthenticated && !isAdmin && (
            <NavLink
              to="/applications"
              className={({ isActive }) =>
                isActive
                  ? "text-white"
                  : "text-white/70 hover:text-white transition"
              }
            >
              My Applications
            </NavLink>
          )}
          {isAdmin && (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white transition"
                }
              >
                Admin
              </NavLink>
              <NavLink
                to="/admin/applications"
                className={({ isActive }) =>
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white transition"
                }
              >
                Applications
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              size="sm"
              onClick={() => navigate("/admin/jobs")}
              className="bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Manage</span>
            </Button>
          )}
          {!isAuthenticated ? (
            <>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20"
              >
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-fuchsia-600 hover:bg-fuchsia-500"
              >
                <Link to="/register">Sign up</Link>
              </Button>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2 text-white/80">
                <User2 className="h-4 w-4" />
                <span className="text-sm">
                  {auth?.user?.name ||
                    auth?.user?.email ||
                    (isAdmin ? "Admin" : "User")}
                </span>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
