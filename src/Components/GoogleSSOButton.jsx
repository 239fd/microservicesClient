import '../Styles/GoogleSSOButton.css';

const GoogleSSOButton = () => {
    const clientId =
        '282982624308-g5c1nltrc5jkacg86fvn485bchdj0egl.apps.googleusercontent.com';
    const redirectUri =
        'http://localhost:8761';
    const scope = 'openid email profile';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&scope=${encodeURIComponent(scope)}&access_type=online&prompt=consent`;

    return (
        <a href={googleAuthUrl} className="google-login-button">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 48 48"
                className="google-icon"
            >
                <path fill="#EA4335"
                      d="M24 9.5c3.69 0 6.37 1.6 7.83 2.94l5.8-5.8C33.41 3.77 28.99 2 24 2 14.94 2 7.49 7.87 4.7 15.44l6.76 5.25C12.73 14.1 17.89 9.5 24 9.5z"/>
                <path fill="#34A853"
                      d="M46.15 24.54c0-1.56-.14-3.07-.41-4.54H24v8.61h12.4c-.54 2.9-2.18 5.37-4.62 7.02l7.2 5.58C43.83 36.34 46.15 30.92 46.15 24.54z"/>
                <path fill="#FBBC05"
                      d="M10.93 28.11a14.68 14.68 0 0 1-.77-4.61c0-1.6.28-3.16.77-4.61l-6.75-5.25A22.053 22.053 0 0 0 2 23.5c0 3.64.87 7.07 2.4 10.11l6.53-5.5z"/>
                <path fill="#4285F4"
                      d="M24 44c5.99 0 11.01-1.99 14.68-5.41l-7.2-5.58c-2.01 1.34-4.59 2.14-7.48 2.14-6.11 0-11.27-4.6-12.5-10.61l-6.76 5.25C7.49 40.13 14.94 46 24 46z"/>
            </svg>
            Войти через Google
        </a>
    );
};

export default GoogleSSOButton;
