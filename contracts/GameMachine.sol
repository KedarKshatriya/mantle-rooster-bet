// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


contract GameMachine is Ownable, ERC721Enumerable  {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using Strings for uint256;
    
    // Optional mapping for token URIs
    mapping (uint256 => string) private _tokenURIs;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function mintToCaller(address _caller, string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_caller, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }

    function burn(uint256 _tokenId) public {
        require(_exists(_tokenId), "Burn for nonexistent token");
        require(ERC721.ownerOf(_tokenId) == msg.sender, "NFT: tokens may be burned by owner only");
        _burn(_tokenId);
    }

}