$(document).ready(function () {
  setTimeout(function () {
    setNftData();
  }
    , 1500);
});
function setNftData() {
  if (metamaskConfig.isMetamaskConnected) {
    nftContract.balanceOf(accountAddress[0]).then(
      function (result) {
        console.log(accountAddress[0]);
        console.log(result);
        const cardDiv =
          `<div class="card bg-light nft-card col-3 m-2" nft-level="{nft-level}" onclick="setTokenId(this.id)" id="{token_id}">
          <img class="card-img-top" src="{nft-image}" alt="Symbals NFT Game">
          <div class="card-body">
              <h5 class="card-title">{nft-title}</h5>
              <p class="card-text">{nft-description}</p>
          </div>
          
          <div class="card-body row">
              <span class="col-4"><strong>Score</strong></span>
              <span class="col-4"><strong>Token ID</strong></span>
              <span class="col-4"><strong>Level</strong></span>
              <span class="col-4">{nft-score}</span>
              <span class="col-4">{token_id}</span>
              <span class="col-4">{nft-level}</span>
          </div>
        </div>`;

        if (result?._hex) {
          let count = parseInt(result._hex);
          for (let i = 0; i < count; i++) {
            nftContract.tokenOfOwnerByIndex(accountAddress[0], i).then(
              function (result) {
                console.log("inside for loop",result);
                if (result?._hex) {
                  let tokenId = parseInt(result._hex);
                  nftContract.tokenURI(tokenId).then(
                    function (result) {
                      if (result) {
                        $.getJSON(result, function (data) {
                          let nftCard = cardDiv
                            .replace(/{token_id}/g, tokenId)
                            .replace(
                              /{nft-score}/g,
                              data?.attributes[2]?.value
                            )
                            .replace(
                              /{nft-level}/g,
                              data?.attributes[1]?.value
                            )
                            .replace(/{nft-title}/g, data.name)
                            .replace(
                              /{nft-description}/g,
                              data.description
                            )
                            .replace(/{nft-image}/, data.image);
                          $(nftCard).appendTo('#outer-div');
                        });
                      }
                    }
                  );
                }
              }
            ).catch(
              function (error) {
                console.log(error);
              }
            )
          }
          console.log()
        }
      }
    ).catch(
      function (error) {
        console.log(error);
      }
    )
  }
}

function setTokenId(tokenId) {
  console.log(tokenId);
  // var t = $(this).attr('tokenId');
  $('#tokenId').val(tokenId);
}

$('.nft-card').click(function () {
  var t = $(this).attr('tokenId');
  console.log(t);
  $('#tokenId').val(t);
});

const contractAbi = [
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_symbol', type: 'string' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'bool', name: '_isFreezeTokenUris', type: 'bool' },
      { internalType: 'string', name: '_initBaseURI', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_value',
        type: 'string',
      },
      { indexed: true, internalType: 'uint256', name: '_id', type: 'uint256' },
    ],
    name: 'PermanentURI',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'PermanentURIGlobal', type: 'event' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_tokenId', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'freezeAllTokenUris',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'freezeTokenUris',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'operator', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isFreezeTokenUris',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'caller', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'string', name: 'tokenURI', type: 'string' },
    ],
    name: 'mintToCaller',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'operator', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_newBaseURI', type: 'string' },
      { internalType: 'bool', name: '_freezeAllTokenUris', type: 'bool' },
    ],
    name: 'update',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
      { internalType: 'string', name: '_tokenUri', type: 'string' },
      { internalType: 'bool', name: '_isFreezeTokenUri', type: 'bool' },
    ],
    name: 'updateTokenUri',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const contract_address = '0xb2C8c173E6A44DcE16cFE0619bA6EDf66a07d8bB';

function consumeNft() {
  try {
    let tokenId = $('#tokenId').val();
    let nftLevel = $(`#${tokenId}`).attr('nft-level');
    console.log(`#${tokenId}`);
    nftContract.burn(tokenId).then(function (result) {
      if (result) {
        console.log(result)
        setMultiplier(accountAddress[0], nftLevel)

      }
    }).catch(function (err) {
      console.log(err);
    })
    // const options721 = {
    //   contractAddress: contract_address,
    //   functionName: 'transferFrom',
    //   abi: contractAbi,
    //   params: {
    //     from: accountAddress[0],
    //     to: '0x000000000000000000000000000000000000dEaD',
    //     tokenId: tokenId,
    //   },
    // };
    // let result721 = null;
    // try {
    //   result721 = await Moralis.executeFunction(options721);
    // } catch (error) {
    //   console.log(error, '\n Burn issue', user, tokenId);
    // }
    // if (result721) {
    //   console.log('nftLevel', nftLevel);
    //   await setMultiplier(accountAddress[0], nftLevel);
    // }
  } catch (error) {
    console.log(error);
    alert('please enter a valid token ID');
  }
}
document.getElementById('btnBurnToken').onclick = consumeNft;
