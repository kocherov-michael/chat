import { Link } from 'react-router-dom';

const MainPage = () => (
    <>
        <h3>MainPage</h3>
        <div>
            MainPage
        </div>
        <nav>
        <ul>
        <li>
            <Link to="/login">Login Page</Link>
        </li>
        <li>
            <Link to="/chat">Chat Page</Link>
        </li>
        </ul>
    </nav>
    </>
);

export default MainPage
