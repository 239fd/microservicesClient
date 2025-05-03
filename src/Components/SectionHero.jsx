import React from 'react';
import AnalyticsImage from './Images/AnalyticsImage.svg';
import ApproveImage from './Images/ApproveImage.svg';
import {startInfoData} from "./StartInfo";

import '../Styles/SectionHero.css';
import DescriptionSection from "./DescriptionSection";


const SectionHero = () => {
    return (
        <div className="heroSection">
            <section className="hero-section">
                <div className="text-section-1">
                    <DescriptionSection title={startInfoData[2].title} description={startInfoData[2].description}/>
                </div>
                <div className="image-section-1">
                    <img src={AnalyticsImage} alt="Аналитика"/>
                </div>

                <div className="image-section-2">
                    <img src={ApproveImage} alt="Отчеты"/>
                </div>
                <div className="text-section-2">
                    <DescriptionSection title={startInfoData[3].title} description={startInfoData[3].description}/>

                </div>
            </section>
        </div>

    );
};

export default SectionHero;
