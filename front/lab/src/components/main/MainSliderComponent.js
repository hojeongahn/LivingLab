import React from "react";
import Flickity from "react-flickity-component";
import Slider1 from "../../resources/images/banner_slider1.png"
import Slider2 from "../../resources/images/banner_slider2.png"
import Slider3 from "../../resources/images/banner_slider3.png"
import Slider4 from "../../resources/images/banner_slider4.png"
import Slider5 from "../../resources/images/banner_slider5.png"

const flickityOptions = {
  autoPlay: 4500, // 자동 슬라이드 전환 시간 
  wrapAround: true, // 무한 루프
  prevNextButtons: false, 
  selectedAttraction: 0.025, 
  friction: 0.65, 
  pauseAutoPlayOnHover: false
};

const MainSliderComponent = () => {
  return (
    <Flickity
      className={'carousel'} // optional className
      elementType={'div'} // default 'div'
      options={flickityOptions}
      disableImagesLoaded={false} // default false
      reloadOnUpdate // default false
      static // default false
    >
      <img src={Slider1} alt="slide1" />
      <img src={Slider2} alt="slide2" />
      <img src={Slider3} alt="slide3" />
      <img src={Slider4} alt="slide4" />   
      <img src={Slider5} alt="slide5" />
    </Flickity>
  );
}

export default MainSliderComponent;
