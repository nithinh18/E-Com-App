import Link from "next/link";

export default function NotFound() {
    return (
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
            <h1 className="text-6xl font-extrabold text-primary mb-4">404</h1>
            <p className="text-secondary mb-8">We couldn&apos;t find the page you were looking for.</p>
            <Link href="/" className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
                Back to Home
            </Link>
        </div>
    );
}
