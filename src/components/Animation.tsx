import Lottie from "lottie-react";
import talkingAnimation from "../assets/talking.json"; // Add your Lottie animation

const Animation = () => (
  <div className="w-72 h-72">
    <Lottie animationData={talkingAnimation} loop />
  </div>
);

export default Animation;
