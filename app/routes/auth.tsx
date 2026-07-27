import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => {[
        { name: 'description', content: 'Log into your account' },
        { title: 'Resume Analyzer | Auth' },
]}

export const Auth = () => {
    const {isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = new URLSearchParams(location.search).get('next') || '/';
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate( next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <section className="card w-full max-w-sm flex flex-col gap-8 p-8 animate-in fade-in duration-300">
                <div className="flex flex-col gap-2 items-center text-center">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-white text-base font-semibold mb-2">
                        R
                    </span>
                    <h1 className="text-2xl!">Welcome back</h1>
                    <h2 className="text-sm!">Sign in to continue your job journey.</h2>
                </div>

                <div className="w-full">
                    { isLoading ? (
                            <button className="auth-button animate-pulse" disabled>
                                Signing you in…
                            </button>
                        ) : (
                            <>
                                { auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>Sign Out</button>
                                ) : (
                                    <button className="auth-button" onClick={auth.signIn}>Sign In</button>
                                )}
                            </>
                        )
                    }
                </div>

            </section>
        </main>
    )
}

export default Auth;