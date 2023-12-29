import axios from "axios";

const serverUrl = process.env.REACT_APP_SERVER_URL;
export const Login = () => {
    const handleLogin = async () => {
        try {
            const { data: { url }} = await axios.get(`${serverUrl}/auth/url`);

            window.location.assign(url);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <h3> Login to Dashboard</h3>
            <button className="btn" onClick={handleLogin}> Login</button>
        </>
    )
}