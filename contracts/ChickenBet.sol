// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract ChickenBet {
    uint public sessionId = 0;
    uint public betPool = 0;
    address public gameDeveloperAddress = 0x952450E079AFBb4f75b1F0Ed94120e6573623bC1;
    uint256 public gameDeveloperCommissionFee = 2;
    address public owner;
    uint public TotalBetNumber = 4;

    struct gameValues {
        uint sessionId;
        uint betNumber;
    }

    struct BetAddress {
        address[] BetterAddr;
    }

    mapping(address => gameValues) addressToBetIndex;
    mapping(uint => BetAddress) indexAddressToBet;

    constructor() {
        owner = msg.sender;
    }

    function setTotalBets(uint _totalBetNumber) public {
        require(msg.sender == owner, "Only owner can call this function");
        TotalBetNumber = _totalBetNumber;
    }

    function setBet(uint _betNo, uint _sessionId) public payable {
        if (sessionId == 0) {
            sessionId = _sessionId;
            for (uint i = 0; i < TotalBetNumber; i++) {
                delete indexAddressToBet[i].BetterAddr;
            }
        }
        if (addressToBetIndex[msg.sender].sessionId != _sessionId) {
            addressToBetIndex[msg.sender].sessionId = _sessionId;
            addressToBetIndex[msg.sender].betNumber = _betNo;
            indexAddressToBet[_betNo].BetterAddr.push(msg.sender);
            betPool += msg.value;
        }
    }

    function gameover(uint _betNo, uint _sessionId) public payable {
        require(msg.sender == owner, "Only owner can call this function");
        require(sessionId == _sessionId);
        address[] memory winnerArray = getAddressPerBet(_betNo);
        uint256 _gameDeveloperCommission = getPercentageOf(
            betPool,
            gameDeveloperCommissionFee
        );

        payable(gameDeveloperAddress).transfer(_gameDeveloperCommission);
        uint _betWinPerAmount = (betPool - _gameDeveloperCommission) / winnerArray.length;

        for (uint i = 0; i < winnerArray.length; i++) {
            address winningPlayerAddress = winnerArray[i];
            payable(winningPlayerAddress).transfer(_betWinPerAmount);
        }
        sessionId = 0;
        betPool = 0;
    }

    function getPercentageOf(uint256 _amount, uint256 _basisPoints) internal pure returns (uint256 value) {
        value = (_amount * _basisPoints) / 100;
    }

    function getBet(address _betterAddress, uint _sessionId) public view returns (uint) {
        if (addressToBetIndex[msg.sender].sessionId == _sessionId) {
            return addressToBetIndex[_betterAddress].betNumber;
        } else {
            return 0;
        }
    }

    function getAddressPerBet(uint _betNo) public view returns (address[] memory) {
        return indexAddressToBet[_betNo].BetterAddr;
    }
}