import React, {useEffect, useState} from "react";
import Header from "../Components/Header";
import LoginPopup from "../Components/LoginPopup";
import RegisterPopup from "../Components/RegisterPopup";
import HeroSection from "../Components/HeroSection";

const WelcomePage = () => {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);

    useEffect(() => {
        setLoginOpen(false);
        setRegisterOpen(false);
    }, []);

    return (
        <div>
            <Header setLoginOpen={setLoginOpen} setRegisterOpen={setRegisterOpen}/>
            <main>
                <HeroSection/>
            </main>
            <LoginPopup open={isLoginOpen} onClose={() => setLoginOpen(false)}/>
            <RegisterPopup open={isRegisterOpen} onClose={() => setRegisterOpen(false)}/>
        </div>
    );
};

export default WelcomePage;
