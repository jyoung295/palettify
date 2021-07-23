import React from 'react'
import './palette-display.scss';

const PaletteDisplay = ({
    paletteData,
    restart
}) => {

    const imgSrc = paletteData.paletteCanvas
    const colors = paletteData.paletteColorsArray

    const copyText = (e) => {
        const text = e.target.innerText
        navigator.clipboard.writeText(text)
    }

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
                                    <p className="color-codes--rgb"><strong>RGB:</strong> <button onClick={copyText} className="color-codes--copy-button">{`${color.rgb.r} ${color.rgb.g} ${color.rgb.b}`}</button> </p>
                                    <p className="color-codes--hex"><strong>HEX:</strong> <button onClick={copyText} className="color-codes--copy-button">{`#${color.hex}`}</button> </p>
                                    <p className="color-codes--cmyk"><strong>CMYK:</strong> <button onClick={copyText} className="color-codes--copy-button">{`${color.cmyk[0]} ${color.cmyk[1]} ${color.cmyk[2]} ${color.cmyk[3]}`}</button> </p>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <button className="palette-display--restart" onClick={restart}>
                <span>Start a new Palette?</span>
                <span className="material-icons restart">undo</span>
            </button>
        </div>
    )
}


export default PaletteDisplay