const betPool = document.getElementById('betValue');
$(document).ready(async function () {
  setTimeout(async function () {
    let betvalue = await getBetPool();
    betPool.innerHTML = `Tokens in Pool `+ betvalue;
  }, 1000);
});

const button = document.getElementById('stream-btn');

let stream;

const { Client } = webRTMP;

async function setup() {
  stream = await navigator.mediaDevices.getDisplayMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
    video: {
      cursor: 'always',
    },
  });
}

button.onclick = async () => {
  await setup();
  const streamKey = '7c9d-nsql-jbv6-dt37';
  console.log('streamKey', streamKey);

  if (!streamKey) {
    alert('Invalid streamKey.');
    return;
  }

  const client = new Client();

  const session = client.cast(stream, streamKey);

  session.on('open', () => {
    console.log('Stream started.');
    fetch('/apiRoute/setStreamStatus', { method: 'GET' })
      .then(async (response) => {
        let resObj = await response.json();
        console.log(`Stream Status Set: `, resObj);
      })
      .catch((error) => {
        console.log(error);
      });
    alert('Stream started; visit Livepeer Dashboard.');
  });

  session.on('close', () => {
    console.log('Stream stopped.');
  });

  session.on('error', (err) => {
    console.log('Stream error.', err.message);
  });
};

const stopButton = document.getElementById('stop-stream-btn');

stopButton.onclick = () => {
  if (!stream) {
    alert('Video streaming not started');
  } else {
    const tracks = stream.getTracks();
    console.log('Stream tracks: ', tracks);
    tracks.forEach((track) => {
      track.stop();
    });
    alert('Streaming has now been stopped!!! ');
    stream = null;
  }
};

async function getBetPool() {
  try {
    let betPool = await bet_contract.betPool();
    parseInt(betPool._hex);
    betPool = ethers.utils.formatEther(betPool);
    if (parseInt(betPool) < 4) {
      $('.stm-btn').prop('disabled', true);
    }
    console.log('Bet Pool: ', betPool);
    return betPool;
  } catch (error) {
    console.log('Error getting bet pool:\n', error);
    return error;
  }
}
