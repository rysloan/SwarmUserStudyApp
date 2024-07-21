import './App.css';
import React, { useState, useEffect } from 'react';

const images = require.context('./swarm_gifs', true);
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
  const [queryCount, setQueryCount] = useState(0)
  
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

  //const [behaviorData, setBehaviorData] = useState(false);
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
    // let id = prompt('Enter your prolific ID');
    let num = parseInt(id);
    setProlificId(id);
  }

  // function getBehaviorData() {
  //   // fetch('/')
  //   //   .then(response => {
  //   //     return response.text();
  //   //   });
  //     // .then(data => {
  //     //   setBehaviorData(data);
  //     // });
  // }

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
      // .then(data => {
      //   alert(data);
      //   getBehaviorData();
      // });
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
              let temp = queryCount + 1;
              setQueryCount(temp);
              if (queryCount >= 10) {
                setStart(true);
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
        >
          {start ? "START" : "NEXT"}
        </button>
      </div>
    </div>
  );
}

export default App;