import React from 'react';
import '../Styles/DescriptionSection.css';


function DescriptionSection(props){
    return (
        <section className="section">
            <h2>{props.title}</h2>
            <p>
                {props.description}
            </p>
        </section>
    );
}

export default DescriptionSection;
