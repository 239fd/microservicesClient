import React from 'react';
import factoryImage from './Images/FactoryImage3.svg';
import computerImage from './Images/ComputerImage2.svg';
import {startInfoData} from "./StartInfo";

import '../Styles/HeroSection.css';
import DescriptionSection from "./DescriptionSection";


const HeroSection = () => {
    return (
        <div className="heroSection">
            <section className="hero-section">
                <div className="text-section-1">
                    <DescriptionSection title={startInfoData[0].title} description={startInfoData[0].description}/>
                </div>
                <div className="image-section-1">
                    <img src={factoryImage} alt="Завод"/>
                </div>

                <div className="image-section-2">
                    <img src={computerImage} alt="Компьютеры"/>
                </div>
                <div className="text-section-2">
                    <DescriptionSection title={startInfoData[1].title} description={startInfoData[1].description}/>

                </div>
            </section>
        </div>

    );
};

export default HeroSection;
