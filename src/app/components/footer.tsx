export default function Footer() {
    return (
        <footer className="w-full mt-10 py-4 text-center text-white" style={{ backgroundColor: '#343434' }}>
            <p>&copy; {new Date().getFullYear()} My League Quiz - Developed by{" "}
                <a href="https://github.com/Sencoool" target="_blank" rel="noopener noreferrer">@Sencoool</a>
                </p>
        </footer>
    )
}
