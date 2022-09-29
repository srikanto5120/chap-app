import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logoImage from "../../assets/images/logo.png";
import userImage from "../../assets/images/user2.jpg";
import { userLoggedOut } from "../../features/auth/authSlice";

export default function Navigation() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  const logout = () => {
    dispatch(userLoggedOut());
    localStorage.clear();
  };
  return (
    <nav className="border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          <Link to="/">
            <img className="h-10" src={logoImage} alt="Learn with Sumit" />
          </Link>

          <ul className="flex gap-2">
            <img
              className="mx-auto h-10 w-10 rounded-full"
              src={userImage}
              alt="Learn with sumit"
            />

            <li className="text-white">
              <span>{user.name}</span>
            </li>
            <li className="text-white">
              <span className="cursor-pointer" onClick={logout}>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
