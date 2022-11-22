export default function ColorBoxes(props) {
    const colorBoxElements = []
    for (let i = 0; i < 2; i++) {
        colorBoxElements.push(
            <div className = "color-div" id = {props.idArray1[i]}>
                <div className = "color-box" id = {props.idArray2[i]} style = {props.styles[i]} onClick = {() => props.handleChoice(i)}></div>
                <h3>Box {i + 1} Stats</h3>
                <p>Likeability Score: {props.likeabilityScore[i]}</p>
            </div>
        )
    }
    return (colorBoxElements)
}