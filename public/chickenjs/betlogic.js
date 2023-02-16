$(document).ready(function () {
    setTimeout (async function () {
    // get session id
    console.log("betContract: ", bet_contract);
    let sessionId = await bet_contract.sessionId();
    // call getBet() with the sessionId
    console.log("sessionId: ", sessionId);
    sessionId = sessionId && sessionId._hex ? parseInt(sessionId?._hex): sessionId;

    betStatus = await bet_contract.getBet(accountAddress[0], sessionId);
    console.log('BetNo from contract; ', betStatus, accountAddress[0]);
    if (betStatus == 0) {
      console.log('no bet for this user');
    } else {
      switch (parseInt(betStatus._hex)) {
        case 1:
          document.getElementById('btnBET1').style.backgroundColor = 'red';
          break;
        case 2:
          document.getElementById('btnBET2').style.backgroundColor = 'red';
          break;
        case 3:
          document.getElementById('btnBET3').style.backgroundColor = 'red';
          break;
        case 4:
          document.getElementById('btnBET4').style.backgroundColor = 'red';
          break;
        default:
          break;
      }
      $('.bet-btn').prop('disabled', true);
    }
    // console.log('COntract data: ', signer, accountAddress[0], bet_contract);

    let streamStatus = await fetch('/apiRoute/getStreamStatus', {method: 'GET'})
    streamStatus = await streamStatus.json()
    console.log("streamStatus: ", streamStatus)
    if(parseInt(streamStatus)===0){
      var checkStreamInterval = setInterval(checkStreamStatus, 10000);
    }
  }, 50);
 
});

async function checkStreamStatus() {
  let streamStatus = await fetch('/apiRoute/getStreamStatus', {method: 'GET'})
  streamStatus = await streamStatus.json()
  if(parseInt(streamStatus)!=0){
    location.reload();
  }
}


// write a function setBet where the bet of that user will be fetched with session id
async function setBet(betNo) {
  try {
    // get session id
    let sessionId = await bet_contract.sessionId();
    console.log("sessionId: ", sessionId);
    sessionId = sessionId && sessionId._hex ? parseInt(sessionId?._hex): sessionId;
    if (sessionId == 0 && betNo == 0) {
      console.log('sessionId , betNo: ', sessionId, betNo);
      console.log('Game is over please wait for next game');
    }
    else {
      await betting(betNo, sessionId);
    }
  } catch (err) {
    console.log(err);
  }
}

// write a bet logic the person will call setBet function
async function betting(betNo, sessionId) {
  try {
    // check if session id is 0 or else create a random new session id
    if (sessionId == 0) {
      // create a new session id
      sessionId = Math.floor(Math.random() * 1000000000);
      console.log('newSessionId: ', sessionId);
      // set the new session id
    }
    const betAmount = ethers.utils.parseEther('1');
    const tx = await bet_contract.setBet(betNo, sessionId, { value: betAmount });
    const reciept = await tx.wait()
    console.log(reciept);
  } catch (err) {
    console.log(err);
  }
}
$('#btnBET1').click(function () {
  console.log('button 1 clicked');
  setBet(1);
});

$('#btnBET2').click(function () {
  console.log('button 2 clicked');
  setBet(2);
});
$('#btnBET3').click(function () {
  console.log('button 3 clicked');
  setBet(3);
});
$('#btnBET4').click(function () {
  console.log('button 3 clicked');
  setBet(4);
});


