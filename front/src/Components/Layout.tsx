import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

function Header() {
    return (
        <>
            <Link to="/">Home</Link>
        </>
    );
}

function Layout() {
    return (
        <>
            <nav>
                <Header />
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;
