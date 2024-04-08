import './App.css';
import React, { useState } from 'react';
import ReactPlayer from "react-player"

const images = require.context('./swarm_gifs', true);
const vids = images.keys().map((v) => images(v));
const tempvids = vids


function getRandomNumInList(size) {
  return Math.floor(Math.random() * size)
}




function App() {
  //const [isClicked, setIsClicked] = useState("red solid 5px")
  //const [isClicked2, setIsClicked2] = useState("red solid 5px")
  function gifToUse(size) {
    console.log(size)
    let index = getRandomNumInList(size)
    let temp = tempvids[index]
    tempvids.splice(index, 1)
    return temp
  }

  function getXGifs(count) {
    let index = 0;
    let arr = []
    for(let i = 0; i < count; i++) {
      console.log(tempvids.length)
      index = getRandomNumInList(tempvids.length)
      arr.push(tempvids[index])
      tempvids.splice(index, 1);
    }
    return arr;
  }
  
  let unpicked = "grey solid 7px"
  let picked = "green solid 7px"
  const [selectedScenes, setSelectedScenes] = useState([])
  const [sceneSelected, setSceneSelected] = useState(false)
  const [start, setStart] = useState(true)
  const [firstGif, setFirstGif] = useState([])
  const [secondGif, setSecondGif] = useState([])
  const [thirdGif, setThirdGif] = useState([])
  
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
              setSelectedScenes([...selectedScenes, info[0]])
              setSceneSelected(true)
            }
            else if(info[1] === picked && sceneSelected) {
              props.handler([info[0], unpicked])
              let temp = selectedScenes
              temp.pop()
              setSelectedScenes(temp)
              setSceneSelected(false)
            }
          }}
      />
    )
  }


  return (
    <div className="App">
      <h1>
        Welcome to the Swarm Behavior Selector
      </h1>
      <h3>
        Pick which behavior you think is unique when compared to the others
      </h3>
      <Gif gif={firstGif} handler={setFirstGif}/>
      <Gif gif={secondGif} handler={setSecondGif}/>
      <Gif gif={thirdGif} handler={setThirdGif}/>
      <div>
        <button 
          onClick={() => {
            //console.log(firstGif[0])
            if (start)
              setStart(false)
            let temp = getXGifs(3)
            setFirstGif([temp[0], unpicked])
            setSecondGif([temp[1], unpicked])
            setThirdGif([temp[2], unpicked])
            setSceneSelected(false)
            console.log(selectedScenes)
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
