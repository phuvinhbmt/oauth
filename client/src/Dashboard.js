import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "./AuthContext";

const serverUrl = process.env.REACT_APP_SERVER_URL;
export const Dashboard = () => {
    const { user, loggedIn, checkLoginState } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        (async () => {
            if (loggedIn === true) {
                try {
                    const { data: { posts }} = await axios.get(`${serverUrl}/user/posts`);
                    setPosts(posts);
                } catch(error) {
                    console.error(error);
                }
            }
        })();
    }, [loggedIn]);

    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/auth/logout`);

            checkLoginState();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <h3>Dashboard</h3>
            <button className="btn" onClick={handleLogout} >Logout</button>
            <h4>{user?.name}</h4>
            <br />
            <p>{user?.email}</p>
            <br />
            <img src={user?.picture} alt={user?.name} />
            <br />
            <div>
                {posts.map((post, idx) => <div key={idx}>
                    <h5>{post?.title}</h5>
                    <p>{post?.body}</p>
                </div>)}
            </div>
        </>
    )
}