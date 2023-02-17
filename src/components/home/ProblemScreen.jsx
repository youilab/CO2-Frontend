import React, { useContext, useEffect } from "react";
import Particles from "react-tsparticles";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import "../../assets/css/problem.css";
import { ThemeContext } from "../../context/ThemeContext";

export const ProblemScreen = () => {
  const {  setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setTheme({dark:true})
  }, []);
  

  return (
    <div>
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: {
              value: "#000",
            },
          },
          fullScreen: {
            zIndex: -2,
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: "#fff",
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}
      />
      <div className="problem-container">
        <CarouselProvider
          infinite={true}
          totalSlides={4}
          style={{ height: 300}}
          isPlaying={true}
          interval={100000}
        >
          <Slider style={{ height: 300}}>
            <Slide style={{ height: 300, margin: 10, background: "hsl(25deg 5% 20%)", opacity:.8, padding: '2rem' }} index={0}>
              <h3 style={ { lineHeight:'2rem', padding: "1rem"}}>
              El papel vital de la ventilación en la propagación de COVID-19 ha sido cuantificado por investigadores, quienes han descubierto que en espacios mal ventilados, el virus puede propagarse más de dos metros en segundos, y es mucho más probable que se propague a través de conversaciones prolongadas que a través de la tos. 
              </h3>
            </Slide>
            <Slide style={{ height: 300, margin: 10, background: "hsl(25deg 5% 30%)", opacity:.8 , padding: '2rem' }}  index={1}>
              <h3 style={ { lineHeight:'2rem', padding: "1rem"}}>
                La exposición al virus en un aula o en una oficina es 1000 veces mayor que en un supermercado y unas 50 veces mayor que ir a tomar un café
              </h3>
            
            </Slide>
            <Slide style={{ height: 300, margin: 10, background: "hsl(25deg 5% 40%)", opacity:.8, padding:0  }} index={2}>
              <div className="img" style={{backgroundImage:"url('https://ca-times.brightspotcdn.com/dims4/default/4477de9/2147483647/strip/true/crop/4000x2667+0+0/resize/840x560!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Ffd%2Fca%2F10375fab4a9f9e49f458b82a6e9f%2Fla-photos-1staff-814075-la-me-masks-mandate-schools-students-21-als.jpg')", backgroundSize:'cover', width: '100%',height: '100%',filter: 'grayscale(1)'}}>

              </div>
            </Slide>
            </Slider>
          <ButtonBack className="btn btn-secundary" >Anterior</ButtonBack>
          <ButtonNext className="btn btn-primary">Siguiente</ButtonNext>
        </CarouselProvider>
      </div>
    </div>
  );
};
