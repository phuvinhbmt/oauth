import {useContext, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "./AuthContext";

const serverUrl = process.env.REACT_APP_SERVER_URL;
const Callback = () => {
    const called = useRef(false);
    const { checkLoginState, loggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            if (loggedIn === false) {
                try {
                    if (called.current) return; // prevent rerender caused by StrictMode
                    called.current = true;
                    console.log('URL ' +window.location.href);
                    const res = await axios.get(`${serverUrl}/auth/token${window.location.search}`);
                    console.log('response: ', res);
                    checkLoginState();
                    navigate('/');
                } catch (err) {
                    console.error(err);
                    navigate('/');
                }
            } else if (loggedIn === true) {
                navigate('/');
            }
        })();
    }, [checkLoginState, loggedIn, navigate])
    return <></>
};

export default Callback;