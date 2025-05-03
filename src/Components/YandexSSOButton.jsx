import '../Styles/YandexSSOButton.css';
import React from "react";

const YandexSSOButton = () => {

    return (
        <a href="https://oauth.yandex.ru/authorize?response_type=code&client_id=95213dd24d8746ab8ff24ccc64b067e4&redirect_uri=http://localhost:8761"
           className="yandex-login-button">
            Войти через Яндекс
        </a>
    );
};

export default YandexSSOButton;
