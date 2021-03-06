import React, { useState } from 'react'
import './Alert.scss';
import { useSpring, animated } from 'react-spring'

const Alert = ({
    alertText = 'Error: no alert text provided from parent component.',
    severity,
}) => {

    console.log()

    const springObj = { to: { y: -200 }, from: { y: 0 }, loop: { reverse: true, delay: 1250 } }

    let springProps = useSpring(springObj)

    return (
        <animated.div style={springProps} className={`alert severity--${severity}`}>
            <p>{alertText}</p>
        </animated.div>
        // <div className={`alert severity--${severity}`}>
        //     <p>{alertText}</p>
        // </div>
    )
}


export default Alert