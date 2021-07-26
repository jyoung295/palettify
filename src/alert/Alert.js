import React, { useState } from 'react'
import './Alert.scss';
import { useSpring, animated } from 'react-spring'

const Alert = ({
    alertText = 'Error: no alert text provided from parent component.',
    severity,
}) => {

    const springProps = useSpring({ to: { y: 100 }, from: { y: 0 } })

    return (
        // <animated.div style={springProps} className={`alert severity--${severity}`}>
        //     <p>{alertText}</p>
        // </animated.div>
        <div className={`alert severity--${severity}`}>
            <p>{alertText}</p>
        </div>
    )
}


export default Alert