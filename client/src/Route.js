import {useContext} from "react";
import {Dashboard} from "./Dashboard";
import {Login} from "./Login";
import {createBrowserRouter} from "react-router-dom";
import Callback from "./Callback";
import {AuthContext} from "./AuthContext";

export const Home = () => {
    const { loggedIn } = useContext(AuthContext);
    if (loggedIn === true) return <Dashboard />;
    if (loggedIn === false) return <Login/>;
    return <></>
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/auth/callback',
        element: <Callback />,
    }
])