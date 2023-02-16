// import connection.js file for metamask connection
var stepTime = 200;
var counter = 0;
var speedMultiplier = 0;
var killCounter = 0;
let accountAddress = null;

// function to check if metamask is installed
var isMetamaskInstalled = () => ethereum.isMetamaskInstalled;

// function to check if metamask is connected to the current chain
var isMetamaskConnected = () => ethereum.isConnected();

// function to enable metamask if its disconnected
const enableMetamask = async () => {
    await ethereum.on("connect", (chainId) => {
        console.log({ chainId });
        console.log("Metamask Connected:", ethereum.isConnected());
    });
};

// function to get metamask chainID
const getChainId = async () => {
    return await ethereum.request({ method: "eth_chainId" });
};

// function to get metamask networkId
const getNetworkId = async () => {
    return await ethereum.request({ method: "net_version" });
};

// function to get metamask account connected with dapp
const getAccount = async () => {
    try {
        let account = await ethereum.request({ method: "eth_accounts" });
        return account;
    } catch (error) {
        console.log("Error getting account:\n", error);
        return error;
    }
};

// function to request metamask to connect with account
const connectToAccount = async () => {
    try {
        let account = await ethereum.request({ method: "eth_requestAccounts" });
        
        return account;
    } catch (error) {
        console.log("Error connecting to metamask account:\n", error);
        return error;
    }
};

const switchToAccount = async () => {
    try {
            // Runs only they are brand new, or have hit the disconnect button
            await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [
                  {
                    eth_accounts: {}
                  }
                ]
              });
    } catch (error) {
        console.log("Error disconnecting from metamask account:\n", error);
        return error;
    }
};
 

// function to get the balance of the connected account
const getBalance = async () => {
    try {
        let account = await getAccount();
        if (account.length === 0) {
            return "Connect to account first!";
        }

        let balance = await signer.getBalance();
        return ethers.utils.formatEther(balance) + " ETH";
    } catch (error) {
        console.log("Error getting balance:\n", error);
        return error;
    }
};

let metamaskConfig = {
    signer,
    isMetamaskInstalled,
    isMetamaskConnected,
    getChainId,
    getNetworkId,
    getAccount,
    connectToAccount,
    switchToAccount,
    getBalance,
};

// const network = document.getElementById('networkId')
const account = document.getElementById("accountId");
// const balance = document.getElementById('balance')

const connect = document.getElementById("btn-login");
const switch_account  = document.getElementById("btn-switch");

// check if metamask is installed in browser
if (metamaskConfig.isMetamaskInstalled) {
    console.log("Metamask is installed!");
} else {
    alert("Install Metamask extension to connect with DApp!");
}

// if metamask is connected do this
const checkOnLoad = async () => {
    if (metamaskConfig.isMetamaskConnected) {
        ethereum.autoRefreshOnNetworkChange = false;
        await metamaskConfig.connectToAccount();
        if ( await metamaskConfig.isMetamaskConnected()) {
            $("#btn-login").css("display", "none");
        }
        console.log(
            "Metamask connected:",
            await metamaskConfig.isMetamaskConnected()
        );
    } else {
        alert("Connect to available ethereum network!");
        console.log("Connect to available ethereum network!");
    }
};
$(document).ready(async function () {
    checkOnLoad();
    accountAddress = await metamaskConfig.connectToAccount();
    account.innerHTML = accountAddress[0];
});

// event triggered when account is changed in metamask
ethereum.on("accountsChanged", async (accounts) => {
    console.log("Account changed from", account);
    account.innerHTML = await metamaskConfig.getAccount();
});

// event triggered when metamask is connected to chain and can make rpc request
ethereum.on("connect", (chainId) => {
    console.log(chainId);
    console.log("Metamask Connected:", ethereum.isConnected());

});

// event triggered when metamask is disconnected from chain and can not make rpc request
ethereum.on("disconnect", (chainId) => {
    console.log(chainId);
    console.log("Metamask Connected:", ethereum.isConnected());
    alert("Metamask is not connected to network. Retry!");
});

// add click event listener on the connect button
connect.addEventListener("click", async (e) => {
    e.preventDefault();

    let getAccountAddress = await metamaskConfig.getAccount();
    if (getAccountAddress.length < 1) {
        getAccountAddress = await metamaskConfig.connectToAccount();
        accountAddress = getAccountAddress;
        account.innerHTML = getAccountAddress;
    } else {
        account.innerHTML = getAccountAddress;
    }
    console.log(getAccountAddress);
});

switch_account.addEventListener("click", async (e) => {
    e.preventDefault();

    let getAccountAddress = await metamaskConfig.getAccount();
    if (getAccountAddress.length < 1) {
        getAccountAddress = await metamaskConfig.switchToAccount();
    } else {
        getAccountAddress = await metamaskConfig.switchToAccount();
    }
    console.log(getAccountAddress);
});
