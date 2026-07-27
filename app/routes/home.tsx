import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, isLoading } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for the Puter auth check to finish, otherwise the initial
    // `isAuthenticated: false` bounces signed-in users to /auth.
    if(!isLoading && !auth.isAuthenticated) navigate( '/auth?next=/');
  }, [isLoading, auth.isAuthenticated])

  return <main>
    <Navbar/>

    <section className="hero-section">
      <div className="page-heading">
        <h1>Track your applications<br/>& resume ratings</h1>
        <h2>Upload your resume to get an ATS score and AI-powered feedback.</h2>

        <Link to="/upload" className="primary-button button-lg w-fit mt-2">
          Upload Resume
        </Link>
      </div>
    </section>
  </main>
}
