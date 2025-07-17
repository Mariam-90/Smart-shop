import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { FaHome, FaTicketAlt, FaInfoCircle, FaCommentAlt, FaUser, FaNewspaper, FaLock } from "react-icons/fa";
import { useState } from 'react';
import './style.css'; // קישור לקובץ העיצוב החדש

const MyNav = ({ children }) => {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('/');

    const menuItem = [
        {
            path: "/",
            name: "בית",
            icon: <FaHome />
        },
        {
            path: "/coupons",
            name: "מבצעים",
            icon: <FaTicketAlt />
        },
        {
            path: "/AboutUs",
            name: "עלינו",
            icon: <FaInfoCircle />
        },
        {
            path: "/ContactUs",
            name: "דבר איתנו",
            icon: <FaCommentAlt />
        },
    ];

    const isLoggedIn = localStorage.getItem('token');

    if (isLoggedIn) {
        menuItem.push({
            path: "/Profile",
            name: "אזור אישי",
            icon: <FaUser />
        });
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('email');
        navigate('/Login');
    };

    const handleLinkClick = (path) => {
        setActiveLink(path);
        navigate(path);
    };

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary navbar-custom" >
                <Container>
                    <Navbar.Brand href="/" className="navbar-custom_1">
                        <Image
                            src="logos.png"
                            width="200"
                            height="200"
                            className="d-inline-block align-top navbar-logo"
                            alt="Smart Shopping logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {menuItem.map((item, index) => (
                                <Nav.Link
                                    key={index}
                                    className={`link ${activeLink === item.path ? 'active' : ''}`}
                                    onClick={() => handleLinkClick(item.path)}
                                >
                                    <div className="icon">{item.icon}</div>
                                    <div className="link_text">{item.name}</div>
                                </Nav.Link>
                            ))}
                            {isLoggedIn ? (
                                <>
                                    <Nav.Link
                                        className={`link ${activeLink === '/articles' ? 'active' : ''}`}
                                        onClick={() => handleLinkClick('/articles')}
                                    >
                                        <div className="icon"><FaNewspaper /></div>
                                        <div className="link_text">כתבות ומתכונים</div>
                                    </Nav.Link>
                                    <Nav.Link
                                        className="link" onClick={handleLogout}
                                    >
                                        <div className="icon"><FaLock /></div>
                                        <div className="link_text">התנתק</div>
                                    </Nav.Link>
                                </>
                            ) : (
                                <Nav.Link
                                    className={`link ${activeLink === '/Login' ? 'active' : ''}`}
                                    onClick={() => handleLinkClick('/Login')}
                                >
                                    <div className="icon"><FaUser /></div>
                                    <div className="link_text">התחבר</div>
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="container">
                <main>{children}</main>
            </div>
        </>
    );
}

export default MyNav;
