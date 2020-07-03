import React from "react";
import "./NavBar.scss";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isChatValid } from "validation";

interface PropsType {
  redirectionUrl?: string;
}

const NavBar: React.FunctionComponent<PropsType> = ({ redirectionUrl }) => {
  const { user, users, privateChats } = useSelector((state: any) => ({
    user: state.user,
    users: state.firestore.data.users,
    privateChats: state.firestore.ordered.privatechats,
  }));

  const numberOfUnreadMessages =
    privateChats &&
    user &&
    privateChats
      .filter(isChatValid)
      .filter((chat: any) => chat.to === user.uid && chat.isRead === false)
      .length;

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark navbar-container">
        <Link to={redirectionUrl || "/"}>
          <span className="navbar-brand title">
            <img
              className="sparkle-icon"
              src="/sparkle-header.png"
              alt="Sparkle collective"
            />
          </span>
        </Link>
        {user && users && users[user.uid] && (
          <div className="icons-container">
            <span className="private-chat-icon">
              {!!numberOfUnreadMessages && numberOfUnreadMessages > 0 && (
                <div className="notification-card">
                  {numberOfUnreadMessages}
                </div>
              )}
              <FontAwesomeIcon icon={faCommentAlt} />
            </span>
            <Link to="/account/edit">
              <img
                src={users[user.uid].pictureUrl}
                className="profile-icon"
                alt="avatar"
                width="40"
                height="40"
              />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
