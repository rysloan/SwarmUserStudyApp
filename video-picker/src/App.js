import './App.css';
import React, { useState, useEffect } from 'react';
import ReactPlayer from "react-player"

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
      console.log(tempvids.length)
      index = getRandomNumInList(tempvids.length)
      arr.push(tempvids[index])
      // tempvids.splice(index, 1);
    }
    return arr;
  }
  
  let unpicked = "grey solid 7px"
  let picked = "green solid 7px"
  // const [selectedScenes, setSelectedScenes] = useState([])
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
              // setSelectedScenes([...selectedScenes, info[0]])
              setSceneSelected(true)
            }
            else if(info[1] === picked && sceneSelected) {
              props.handler([info[0], unpicked])
              // let temp = selectedScenes
              // temp.pop()
              // setSelectedScenes(temp)
              setSceneSelected(false)
            }
          }}
      />
    )
  }

  const [behaviorData, setBehaviorData] = useState(false);
  const [prolificId, setProlificId] = useState();

  function getProlificId() {
    let id = prompt('Enter your prolific ID');
    let num = parseInt(id);
    setProlificId(num);
  }

  function getBehaviorData() {
    fetch('/') // NO LONGER FETCHING FROM localhost
      .then(response => {
        return response.text();
      })
      .then(data => {
        setBehaviorData(data);
      });
  }

  function createBehaviorData(gif1, gif2, gif3, gifSelected) {
    // let name = prompt('Enter merchant name');
    // let email = prompt('Enter merchant email');
    console.log(prolificId)
    let selected = gifSelected
    let prolificid = prolificId
    fetch('/behaviordata', { // REMOVE EVERYTHING BEFORE /behaviordata
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({prolificid, gif1, gif2, gif3, selected}),
    })
      .then(response => {
        console.log(response);
        return response.text();
      })
      .then(data => {
        console.log(data);
        alert(data);
        getBehaviorData();
      });
  }

  // function deleteMerchant() {
  //   let id = prompt('Enter merchant id');
  //   fetch(`http://localhost:3001/merchants/${id}`, {
  //     method: 'DELETE',
  //   })
  //     .then(response => {
  //       return response.text();
  //     })
  //     .then(data => {
  //       alert(data);
  //       getMerchant();
  //     });
  // }

  // function updateMerchant() {
  //   let id = prompt('Enter merchant id');
  //   let name = prompt('Enter new merchant name');
  //   let email = prompt('Enter new merchant email');
  //   fetch(`http://localhost:3001/merchants/${id}`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({name, email}),
  //   })
  //     .then(response => {
  //       return response.text();
  //     })
  //     .then(data => {
  //       alert(data);
  //       getMerchant();
  //     });
  // }

  useEffect(() => {
    getBehaviorData();
  }, []);


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
              //createBehaviorData('test1', 'test2', 'test3', 1)
            }

            // Repopulate gifs with new gifs
            let temp = getXGifs(3)
            setFirstGif([temp[0], unpicked])
            setSecondGif([temp[1], unpicked])
            setThirdGif([temp[2], unpicked])

            // Reset Scene Selected
            setSceneSelected(false)
            // console.log(selectedScenes)
          }}
          style={{width: '125px', height: '50px', margin: '10px 10px auto'}}
        >
          {start ? "START" : "NEXT"}
        </button>
      </div>
      {behaviorData ? behaviorData : 'There is no merchant data available'}
      {/* <br />
      <button onClick={createMerchant}>Add merchant</button>
      <br />
      <button onClick={deleteMerchant}>Delete merchant</button>
      <br />
      <button onClick={updateMerchant}>Update merchant</button> */}
    </div>
  );
}

export default App;
