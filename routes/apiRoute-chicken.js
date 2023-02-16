const router = require('express').Router();
const axios = require('axios');
const { ethers, Wallet, providers } = require('ethers');
const { connect } = require('@textile/tableland');
const fetch = require('node-fetch');
const nftContractAbi = require('./ABI.js');
const BetContractAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'TotalBetNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'betPool',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'gameDeveloperAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'gameDeveloperCommissionFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_betNo',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_sessionId',
        type: 'uint256',
      },
    ],
    name: 'gameover',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_betNo',
        type: 'uint256',
      },
    ],
    name: 'getAddressPerBet',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_betterAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_sessionId',
        type: 'uint256',
      },
    ],
    name: 'getBet',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'sessionId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_betNo',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_sessionId',
        type: 'uint256',
      },
    ],
    name: 'setBet',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_totalBetNumber',
        type: 'uint256',
      },
    ],
    name: 'setTotalBets',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const cntBetAddress = '0x18616BE6eBD2f67d955AccD2eaaF717bC24973bc';

globalThis.fetch = fetch;

// Since we don't have Metamask, you need to supply a private key directly
let privKey = process.env.PRIV_KEY2;
const wallet = new Wallet(privKey);
const provider = new providers.AlchemyProvider(
  'goerli',
  process.env.ALCHEMY_KEY
);
const signer = wallet.connect(provider);
// blockchain implementation
const DevnetRpcUrl = 'https://rpc.testnet.mantle.xyz/';
var HttpProvider = new ethers.providers.JsonRpcProvider(DevnetRpcUrl);
const signer2 = wallet.connect(HttpProvider);
let scoreTableRes, highTableRes;

router.route('/mintNft').post(async (req, res) => {
  try {
    const { address, url } = req.body;
    const contract = new ethers.Contract(
      process.env.CHICKEN_NFT,
      nftContractAbi,
      signer2
    );
    const tx = await contract.mintToCaller(address, url);
    console.log('Receipt:', tx);
    res.json(tx);
  } catch (error) {
    console.log(error);
    res.send(false);
  }
});
let score = {};
router.route('/betScore').post(async (req, res) => {
  try {
    const { score, id } = req.body;

    const tx = await contract.mintToCaller(address, url);
    console.log('Receipt:', tx);
    res.json(tx);
  } catch (error) {
    console.log(error);
    res.send(false);
  }
});
router.route('/createScoreTable').get(async (req, res) => {
  const tbl = await connect({ network: 'testnet', signer });
  scoreTableRes = await tbl.create(
    `CREATE TABLE scoreBoard (address text, score int, primary key (address));`
  );
  console.log(scoreTableRes);
});

router.route('/listTables').get(async (req, res) => {
  const tbl = await connect({ network: 'testnet', signer });
  const tables = await tbl.list();
  console.log(tables);
});

router.route('/createHighTable').get(async (req, res) => {
  const tbl = await connect({ network: 'testnet', signer });
  highTableRes = await tbl.create(
    `CREATE TABLE highBoard (address text, score int, primary key (address));`
  );
});

router.route('/updateScores/:address/:score').get(async (req, res) => {
  try {
    const tbl = await connect({ network: 'testnet', signer });
    const address = req.params.address;
    const score = req.params.score;

    const queryableName = 'scoreboard_450';
    console.log(queryableName);

    const queryRes = await tbl.query(
      `SELECT * FROM ${queryableName} WHERE address = '${address}';`
    );
    console.log('before update', queryRes);
    if (queryRes?.data?.rows && queryRes.data.rows.length > 0) {
      const deleteRes = await tbl.query(
        `DELETE FROM ${queryableName} WHERE address = '${address}';`
      );
    }
    queryToSend =
      `INSERT INTO ${queryableName} (address, score) VALUES ('${address}', ` +
      Number(score) +
      `);`;

    const insertRes = await tbl.query(queryToSend);
    console.log('Insert Rest', insertRes);
    // add contract calling here
    // let contract = new ethers.Contract(chainLinkVrfContractAddress, contractAbi, signer);
    // let transaction = await contract.requestRandomWords();
    // let tx = await transaction.wait()
    // console.log(tx);

    res.send('Success');
  } catch (error) {
    console.log(error);
    res.send('Error');
  }
});

router.route('/getScores/:address').get(async (req, res) => {
  try {
    const tbl = await connect({ network: 'testnet', signer });
    const address = req.params.address;

    const queryableName = 'scoreboard_450';
    console.log(queryableName);
    const queryRes = await tbl.query(
      `SELECT * FROM ${queryableName} WHERE address = '${address}';`
    );
    if (queryRes.length !== 0) {
      // let contract = new ethers.Contract(chainLinkVrfContractAddress, contractAbi, signer);
      // let transaction = await contract.s_requestId();
      // console.log(transaction);
      // let randomNum = String(parseInt(transaction._hex));
      let randomNum = Math.floor(Math.random(1) * 10);
      // console.log(randomNum.length);
      // console.log(randomNum[11]);
      queryRes.randVRFNumber = randomNum; //randomNum[11];
      res.send(queryRes);
    } else {
      res.send('Not Available');
    }
  } catch (error) {
    console.log(error);
    res.send('Error');
  }
});

router.route('/delScores/:address').get(async (req, res) => {
  try {
    const tbl = await connect({ network: 'testnet', signer });
    const address = req.params.address;

    const queryableName = 'scoreboard_450';
    console.log(queryableName);
    const queryRes = await tbl.query(
      `DELETE FROM ${queryableName} WHERE address = '${address}';`
    );
    if (queryRes.length !== 0) {
      res.send(queryRes);
    } else {
      res.send('Not Available');
    }
  } catch (error) {
    console.log(error);
    res.send('Error');
  }
});
let currentStreamStatus = 0;

router.route('/gameOver').post(async (req, res) => {
  try {
    const { score } = req.body;
    const bet_contract = new ethers.Contract(
      cntBetAddress,
      BetContractAbi,
      signer2
    );
    const betNo = Math.floor(parseInt(score)/50)+1;
    console.log('betlog', await bet_contract);
    const sessionId = await bet_contract.sessionId();
    console.log('bet and sessionid', betNo , parseInt(sessionId._hex));
    if (parseInt(sessionId._hex) != 0) {
    console.log('bet and sessionid', betNo , parseInt(sessionId._hex));
    const tx = await bet_contract.gameover(betNo, parseInt(sessionId._hex));
    const reciept = await tx.wait();
    console.log('Receipt:', reciept);
    currentStreamStatus = 0;
    res.json(reciept);
    } else {
      console.log('sessionid' , parseInt(sessionId._hex));
      currentStreamStatus = 0;
    }
  } catch (error) {
    console.log(error);
    res.send(false);
  }
});
router.route('/setStreamStatus').get(async (req, res) => {
  try {
    currentStreamStatus = 1;
    res.json(currentStreamStatus);
  } catch (error) {
    console.log(error);
    res.send(false);
  }
});
router.route('/getStreamStatus').get(async (req, res) => {
  try {
    res.json(currentStreamStatus);
  } catch (error) {
    console.log(error);
    res.send(false);
  }
});
module.exports = router;
