export default function BigButton({ text, color }: { text: string, color: string }) {
    return (
        <button style={{ backgroundColor: color }} className="text-black rounded-lg p-4 font-semibold">{text}</button>
    )
}