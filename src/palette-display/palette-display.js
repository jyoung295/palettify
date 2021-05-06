import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import './palette-display.scss';

const PaletteDisplay = ({
    paletteData,
    restart
}) => {

    const imgSrc = paletteData.paletteCanvas
    const colors = paletteData.paletteColorsArray

    return (
        <div className="palette-display">
            <img className="palette-display--image" alt="Your original upload with your palette!" src={imgSrc} />
            <table className="palette-display--table">
                <thead>
                    <tr>
                        <th>Color</th>
                        <th>Color space codes</th>
                    </tr>
                </thead>
                <tbody>
                    {colors.map(color => {
                        return (
                            <tr key={`#${color.hex}`}>
                                {/* left column, color key */}
                                <td className="color-key">
                                    <div style={{backgroundColor: `#${color.hex}`}} className="color-key--brick"></div>
                                </td>
                                {/* right column, color codes */}
                                <td className="color-codes">
                                    <p className="color-codes--rgb"><strong>RGB:</strong> {`${color.rgb.r} ${color.rgb.g} ${color.rgb.b}`}</p>
                                    <p className="color-codes--hex"><strong>HEX:</strong> {`#${color.hex}`}</p>
                                    <p className="color-codes--cmyk"><strong>CMYK:</strong> {`${color.cmyk[0]} ${color.cmyk[1]} ${color.cmyk[2]} ${color.cmyk[3]}`}</p>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <button className="palette-display--restart" onClick={restart}>
                Start a new Palette?
                <FontAwesomeIcon icon="undo" size="sm" />
            </button>
        </div>
    )
}


export default PaletteDisplay