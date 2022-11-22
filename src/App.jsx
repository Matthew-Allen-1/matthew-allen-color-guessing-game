import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import ColorBoxes from './Components/ColorBoxes'

function assignRandomColor() {
  return {
    red: Math.floor(Math.random() * 255),
    green: Math.floor(Math.random() * 255),
    blue: Math.floor(Math.random() * 255),
  }
}

function convertColorToHex(color) {
  const redString = color.red > 15 ? color.red.toString(16) : '0' + color.red.toString(16)
  const greenString = color.green > 15 ? color.green.toString(16) : '0' + color.green.toString(16)
  const blueString = color.blue > 15 ? color.blue.toString(16) : '0' + color.blue.toString(16)
  return ('#' + redString + greenString + blueString)
}

function distanceBetweenTwoColors(color1, color2) {
  return Math.sqrt((color1.red - color2.red)**2 + (color1.green - color2.green)**2 + (color1.blue - color2.blue)**2)
}

const color = [assignRandomColor(), assignRandomColor()]
const hex = [convertColorToHex(color[0]), convertColorToHex(color[1])]

const avgDistance = [{pro: 0, con: 0}, {pro: 0, con:0}]
const avgLocalDistance = [{pro: 0, con: 0}, {pro: 0, con:0}]

const colorChoices = [], favoriteColors = []
let likeabilityArray = []
const likeabilityScore = [0, 0]
let prediction = 2, correctPredictions = 0, counter = 0, predictionMessage = 'I will not make a prediction until you have made at least 10 choices.'
let successRateMessage = 'I have not yet attempted a prediction.'
let euclideanDistance = distanceBetweenTwoColors(color[0], color[1])

function App() {

  const [styles, setStyles] = useState([{backgroundColor: hex[0]}, {backgroundColor: hex[1]}])
  const [newRows, setNewRows] = useState([{x1: 0, y1: 0, z1: 0, x2: 0, y2: 0, z2: 0}])
  const [favoritesStyles, setFavoritesStyles] = useState([])

  const predictionAnimation = [
    {transform: 'rotate(0) scale(1)'},
    {transform: 'rotate(12deg) scale(1)'},
    {transform: 'rotate(-12deg) scale(1)'},
    {transform: 'rotate(0) scale(1)'}
  ];

  const predictionAnimationTiming = {
    duration: 384,
    iterations: 1.5,
    fill: 'forwards'
  }
  
  function likeabilityCalc(color) {
    const likeability = colorChoices.reduce((runningTotal, currentItem) => {
      return (runningTotal + 1/(distanceBetweenTwoColors(currentItem.pro, color)**2 + 1) - 1/(distanceBetweenTwoColors(currentItem.con, color)**2 + 1))
      }, 0)
    return Math.round(1000000 * likeability / colorChoices.length)
  }

  //Function to be called when the user clicks on their preferred color box.
  function handleChoice(int) {

    //Record the preferred and not preferred color choices in an array.
    colorChoices.push({
      pro: color[int],
      con: color[1 - int]
    })
    console.log('Color Choices: ', colorChoices)

    //Update the running tally of likeability prediction success.
    if (colorChoices.length >= 10) {
      if (prediction == int) {
        predictionMessage = 'My prediction was correct!'
        correctPredictions++
        counter++
      }
      else if (prediction != int && prediction < 2) {
        predictionMessage = 'My prediction was incorrect!'
        counter++
      }
      else {predictionMessage = 'I did not make a prediction.'}
      if (counter >= 1) {successRateMessage = 'So far, my prediction success rate is ' + Math.round(100 * correctPredictions/counter) + '%'}
    }

    //Animate the predicted color.
    document.getElementById(['color1', 'color2', 'box3'][prediction]).animate(predictionAnimation, predictionAnimationTiming).finished
      .then(res => {
        console.log(res)
        // Choose two new random colors, assign the hex strings for each, and calculate the average distance pro and con for the new colors.
        do {
          for (let i = 0; i < 2; i++) {
            color[i] = assignRandomColor()
            hex[i] = convertColorToHex(color[i])
            likeabilityScore[i] = likeabilityCalc(color[i])
          }

          //Calculate the Euclidean distance between the two colors.
          euclideanDistance = distanceBetweenTwoColors(color[0], color[1])
        }
        while (euclideanDistance < 100)

        //Predict which color the user will prefer based on likeability scores.
        if (colorChoices.length >= 10) {
          if (likeabilityScore[1] > likeabilityScore[0]) {prediction = 1}
          else if (likeabilityScore[1] < likeabilityScore[0]) {prediction = 0}
          else {prediction = 2}
        }

        // Set the new background colors of the boxes on the screen
        setStyles([{backgroundColor: hex[0]}, {backgroundColor: hex[1]}])
      })
  }

  return (
    <main>
      <h1>Pick Your Favorite Color!</h1>
      <h2>Please click on the color that you prefer.</h2>
      <div id = "color-boxes">
        <ColorBoxes 
          idArray1 = {['box1', 'box2']}
          idArray2 = {['color1', 'color2']}
          likeabilityScore = {likeabilityScore}
          handleChoice = {handleChoice}
          styles = {styles}
          />
      </div>
      <h3>{predictionMessage}</h3>
      <h3>{successRateMessage}</h3>
      <div id = 'box3'></div>
    </main>
  )
}

export default App
