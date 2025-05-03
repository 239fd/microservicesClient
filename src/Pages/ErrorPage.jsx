import React from "react";
import ErrorImage from "../Components/Images/ErrorPage.svg"

const ErrorPage = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center"
        }}>
            <section className="image" style={{ width: "100%" }}>
                <img src={ErrorImage} alt="Ошибка" style={{ width: "38%" }} />
            </section>
        </div>
    );
}

export default ErrorPage;
