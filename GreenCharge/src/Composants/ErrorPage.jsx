import { Link } from "react-router-dom";
import '../style/ErrorPage.css';

const ErrorPage = () => {
    return (
        <div className="container center-container">
            <div className="main text-center">
                <h1>
                    <p>Oops! Something went wrong. Please try again later.</p>
                    <li className=""><Link to="/">Revenir à l'accueil</Link></li>
                </h1>
            </div>
        </div>
    );
}

export default ErrorPage;
