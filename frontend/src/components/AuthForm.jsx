import "../styles/AuthForm.css";

export default function AuthForm() {
  return (
    <div className="container">
      <div className="login-box">
        <div className="left">
          <div className="circle" />
          <button className="signup-btn">SIGN UP</button>
          <h1>WELCOME!</h1>
          <p>
            Log in to access your customized mindfulness exercises, track your
            progress, and unlock more insights into your mental wellbeing.
          </p>
          <input type="email" placeholder="Email" />
          <button className="continue-btn">Continue</button>
          <div className="divider">or</div>
          <div className="socials">
            <button className="social-btn">G</button>
            <button className="social-btn"></button>
            <button className="social-btn">t</button>
            <button className="social-btn">f</button>
          </div>
          <div className="terms">
            By proceeding, you agree to our <a href="#">Terms of Use</a>. Read
            our <a href="#">Privacy Policy</a>.
          </div>
        </div>
        <div className="right">{/* Add background image or SVG here */}</div>
      </div>
    </div>
  );
}
