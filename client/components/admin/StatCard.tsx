export default function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-white border border-border rounded-2xl p-5">
            <p className="text-2xl font-extrabold text-primary mb-1">{value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-secondary">{label}</p>
        </div>
    );
}
