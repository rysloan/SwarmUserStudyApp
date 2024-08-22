import './App.css';
import React, { useState, useEffect } from 'react';

const images = require.context('./SwarmVideos', true);
const vids = images.keys().map((v) => images(v));
const tempvids = vids


function getRandomNumInList(size) {
  return Math.floor(Math.random() * size)
}




function App() {

  function getGifNumber(gifPath) {
    let split = gifPath.split('/')
    let split2 = split[split.length - 1].split('.')
    return split2[0]
  }

  /**
   * Get X amount of gifs from the ./SwarmVideos file and returns them as an array
   * 
   * @param count amount of gifs to grab and return
   * 
   * @returns an array of gifs with length equal to count
   */
  function getXGifs(count) {
    let index = 0;
    let arr = []
    for(let i = 0; i < count; i++) {
      index = getRandomNumInList(tempvids.length)

      //let gifNumber = getGifNumber(tempvids[index]);
      arr.push(tempvids[index]);

    }
    return arr;
  }

  function userTest() {
    // pick two of the same gif
    let index = getRandomNumInList(tempvids.length)
    let arr = []

    //let gifNumber = getGifNumber(tempvids[index]);
    arr.push(tempvids[index])

    let index2 = index;
    while (index2 === index) {
      index2 = getRandomNumInList(tempvids.length)
    }

    //gifNumber = getGifNumber(tempvids[index2]);
    arr.push(tempvids[index2])

    return arr;
  }

  /**
   * Creates a gif object 
   * 
   * @param props details about the gif to create (prop.gif = the gif data | props.handler = the gif setter method)
   * 
   * @returns a gif object
   */
  function Gif(props) {
    let info = props.gif
    if (start) 
      return null
    return(
        <img 
          src={info[0]} 
          alt='loading...' 
          height={250} 
          width={250} 
          style={{border: info[1], margin: '10px 10px auto', transform: 'rotateX(90)'}}
          onClick={() => {
            if (info[1] === unpicked && !sceneSelected) {
              console.log(firstGif[0] + " " + secondGif[0] + " " + thirdGif[0])
              setFirstGif(firstGif[0], unpicked)
              setSecondGif(secondGif[0], unpicked)
              setThirdGif(thirdGif[0], unpicked)
              props.handler([info[0], picked])
              setSceneSelected(true)
            }
            else if(info[1] === picked && sceneSelected) {
              setFirstGif(firstGif[0], unpicked)
              setSecondGif(secondGif[0], unpicked)
              setThirdGif(thirdGif[0], unpicked)
              //props.handler([info[0], unpicked])
              setSceneSelected(false)
            }
          }}
      />
    )
  }

  /**
   * Gets the prolific id of the user from the url parameters, if none is found then default to testID
   */
  function getProlificId() {
    const url = window.location.href;
    const split = url.split('?');
    console.log(url);
    console.log(split);
    let id = "testID";
    if (split.length > 1) {
      id = split[1].substring(13, 37);
    }
    else {
      id = prompt("Please enter your name below:")
    }
    while (id === null) {
      id = prompt("Please enter your name below:")
    }
    setProlificId(id);
  }

  /**
   * Creates a new row in the backend database
   * 
   * @param gif1 The 
   * @param gif2
   * @param gif3
   * @param gif1
   * 
   * @returns a gif object
   */
  function createBehaviorData(gif1, gif2, gif3, gifSelected) {
    let selected = gifSelected
    let prolificid = prolificId
    fetch('/behaviordata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({prolificid, gif1, gif2, gif3, selected}),
    })
      .then(response => {
        return response.text();
      });
  }

  let unpicked = "grey solid 7px"
  let picked = "green solid 7px"
  //const storedQueryCount = parseInt(JSON.parse(localStorage.getItem("queryCount")))
  const storedQueryCount = 0

  const [sceneSelected, setSceneSelected] = useState(false)
  const [start, setStart] = useState(true)
  const [firstGif, setFirstGif] = useState([])
  const [secondGif, setSecondGif] = useState([])
  const [thirdGif, setThirdGif] = useState([])
  const [queryCount, setQueryCount] = useState(storedQueryCount)
  const [finished, setFinished] = useState(false)
  const [prolificId, setProlificId] = useState();
  const [testIdealAnswer, setTestIdealAnswer] = useState(-1);

  useEffect(() => {

    //localStorage.setItem("queryCount", JSON.stringify(queryCount))

    if (queryCount >= 50) {
      alert("You have finished the study, Thank you! Completion Code: CK53M54P")
      setStart(true);
      setFinished(true);
    }

  }, [queryCount]) 

  return (
    <div className="App">
      <h1>
        Welcome to the Swarm Behavior Selector
      </h1>
      <h3>
        {start ? "Click the start button below to begin the study" : "Below are 3 examples of robot swarms working together. Between the 3 which behavior is the most different from the other two? Select the video that corrresponds with your answer and then click “Next” If all behaviors are different or all behaviors are the same, click next without selecting a behavior."}
      </h3>
      <h4>
        Answered: {queryCount}/50
      </h4>
      <Gif gif={firstGif} handler={setFirstGif}/>
      <Gif gif={secondGif} handler={setSecondGif}/>
      <Gif gif={thirdGif} handler={setThirdGif}/>
      <div>
        <button 
          onClick={() => {
            // Change Button From START -> NEXT
            if (start) {
              setStart(false)
              getProlificId()
            }
            else {
              let selected = -1;
              if (firstGif[1] === picked)
                selected = 1
              else if (secondGif[1] === picked)
                selected = 2
              else if (thirdGif[1] === picked)
                selected = 3

              if (testIdealAnswer !== -1) {
                // Save data to database
                let goodTester = false;
                if (selected === testIdealAnswer)
                  goodTester = true;

                // TODO : Need to trucate the gif to just the number and not the entire path
                let gifNumber1 = getGifNumber(firstGif[0])
                let gifNumber2 = getGifNumber(secondGif[0])
                let gifNumber3 = getGifNumber(thirdGif[0])
                createBehaviorData(gifNumber1, gifNumber2, gifNumber3, selected)
                let temp = queryCount + 1;
                setQueryCount(temp);
                setTestIdealAnswer(-1);
              }
              else {
                let gifNumber1 = getGifNumber(firstGif[0])
                let gifNumber2 = getGifNumber(secondGif[0])
                let gifNumber3 = getGifNumber(thirdGif[0])
                createBehaviorData(gifNumber1, gifNumber2, gifNumber3, selected)
                let temp = queryCount + 1;
                setQueryCount(temp);
              } 
            }

            if (queryCount % 15 === 0) {
              // Run the Test Query
              let temp = userTest();
              let random = Math.floor(Math.random() * 3);
              switch(random) {
                case 0:
                  setTestIdealAnswer(1);
                  setFirstGif([temp[1], unpicked])
                  setSecondGif([temp[0], unpicked])
                  setThirdGif([temp[0], unpicked])
                  break;
                case 1:
                  setTestIdealAnswer(2);
                  setFirstGif([temp[0], unpicked])
                  setSecondGif([temp[1], unpicked])
                  setThirdGif([temp[0], unpicked])
                  break;
                case 2:
                  setTestIdealAnswer(3);
                  setFirstGif([temp[0], unpicked])
                  setSecondGif([temp[0], unpicked])
                  setThirdGif([temp[1], unpicked])
                  break;
                default:
              }
            }
            else {
              // Repopulate gifs with new gifs
              let temp = getXGifs(3)
              setFirstGif([temp[0], unpicked])
              setSecondGif([temp[1], unpicked])
              setThirdGif([temp[2], unpicked])
            }
        
            // Reset Scene Selected
            setSceneSelected(false)
          }}
          style={{width: '125px', height: '50px', margin: '10px 10px auto'}}
          disabled={finished}
        >
          {start ? "START" : "NEXT"}
        </button>
      </div>
      <h1>
        {finished ? "Thank You for Completing the Study! Prolific Completion Code: CK53M54P" : null}
      </h1>
    </div>
  );
}

export default App;