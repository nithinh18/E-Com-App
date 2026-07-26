import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-extrabold text-primary">Create Account</h1>
                <p className="text-secondary text-sm mt-1">Sign up to get started</p>
            </div>
            <SignUp
                appearance={{
                    variables: { colorPrimary: "#111111" },
                    elements: {
                        card: "shadow-none border border-border rounded-2xl",
                    },
                }}
            />
        </div>
    );
}
