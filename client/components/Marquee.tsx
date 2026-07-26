const ITEMS = ["FREE SHIPPING OVER $50", "NEW DROPS WEEKLY", "24/7 SUPPORT", "EASY 30-DAY RETURNS"];

export default function Marquee() {
    const content = (
        <div className="flex items-center shrink-0">
            {ITEMS.map((item, i) => (
                <div key={i} className="flex items-center">
                    <span className="text-white text-xs font-bold tracking-wider uppercase">{item}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 mx-6" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-primary py-3 overflow-hidden">
            <div className="flex w-max animate-marquee">
                {content}
                {content}
            </div>
        </div>
    );
}
