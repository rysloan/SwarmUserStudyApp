import './App.css';
import React, { useState, useEffect } from 'react';

const images = require.context('./SwarmVideos', true);
const vids = images.keys().map((v) => images(v));
const tempvids = vids


function getRandomNumInList(size) {
  return Math.floor(Math.random() * size)
}




function App() {

  function getXGifs(count) {
    let index = 0;
    let arr = []
    for(let i = 0; i < count; i++) {
      index = getRandomNumInList(tempvids.length)
      arr.push(tempvids[index])
    }
    return arr;
  }

  let unpicked = "grey solid 7px"
  let picked = "green solid 7px"

  const [sceneSelected, setSceneSelected] = useState(false)
  const [start, setStart] = useState(true)
  const [firstGif, setFirstGif] = useState([])
  const [secondGif, setSecondGif] = useState([])
  const [thirdGif, setThirdGif] = useState([])
  //const [queryCount, setQueryCount] = useState(0)
  const [finished, setFinished] = useState(false)
  
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
          style={{border: info[1], margin: '10px 10px auto'}}
          onClick={() => {
            if (info[1] === unpicked && !sceneSelected) {
              props.handler([info[0], picked])
              setSceneSelected(true)
            }
            else if(info[1] === picked && sceneSelected) {
              props.handler([info[0], unpicked])
              setSceneSelected(false)
            }
          }}
      />
    )
  }

  const [prolificId, setProlificId] = useState();

  function getProlificId() {
    const url = window.location.href;
    const split = url.split('?');
    console.log(url);
    console.log(split);
    let id = "testID";
    if (split.length > 1) {
      id = split[1].substring(13, 37);
    }
    setProlificId(id);
  }

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

  return (
    <div className="App">
      <h1>
        Welcome to the Swarm Behavior Selector
      </h1>
      <h3>
        Below are 3 examples of robot swarms working together. Between the 3 which one stands out to you the most?
      </h3>
      <Gif gif={firstGif} handler={setFirstGif}/>
      <Gif gif={secondGif} handler={setSecondGif}/>
      <Gif gif={thirdGif} handler={setThirdGif}/>
      <div>
        <button 
          onClick={() => {
            // Change Button From START -> NEXT
            if (start) {
              localStorage.setItem("queryCount", JSON.stringify(0))
              setStart(false)
              getProlificId()
            }
            else {
              // Save data to database
              let selected = -1;
              if (firstGif[1] === picked)
                selected = 1
              else if (secondGif[1] === picked)
                selected = 2
              else if (thirdGif[1] === picked)
                selected = 3

              createBehaviorData(firstGif[0], secondGif[0], thirdGif[0], selected)
              let queryCount = JSON.parse(localStorage.getItem("queryCount"))
              let number = parseInt(queryCount)
              let temp = number + 1
              //let temp = queryCount + 1;
              //setQueryCount(temp);
              // if (queryCount >= 9) {
              //   alert("You have finished the study, Thank you! Completion Code: CK53M54P")
              //   setStart(true);
              //   setFinished(true);
              // }
              localStorage.setItem("queryCount", JSON.stringify(temp))
              console.log(temp)
              if (temp >= 9) {
                alert("You have finished the study, Thank you! Completion Code: CK53M54P")
                setStart(true);
                setFinished(true);
              }
            }

            // Repopulate gifs with new gifs
            let temp = getXGifs(3)
            setFirstGif([temp[0], unpicked])
            setSecondGif([temp[1], unpicked])
            setThirdGif([temp[2], unpicked])

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