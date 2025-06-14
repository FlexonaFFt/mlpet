import Silk from "./Silk";
import "../styles/AuthForm.css";

const AuthForm = () => {
  return (
    <div className="container">
      <div className="login-box">
        <div className="left">
          <div className="circle" />
          <button className="signup-btn">Sign Up</button>
          <h1>Welcome Back</h1>
          <p>Please enter your email to continue.</p>
          <input type="email" placeholder="Email" />
          <button className="continue-btn">Continue</button>
          <div className="divider">or continue with</div>
          <div className="socials">
            <button className="social-btn">G</button>
            <button className="social-btn">F</button>
            <button className="social-btn">T</button>
          </div>
          <div className="terms">
            By continuing, you agree to our <a href="#">Terms</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
        <div className="right">
          <Silk
            speed={5}
            scale={1}
            color="#7B7481"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
