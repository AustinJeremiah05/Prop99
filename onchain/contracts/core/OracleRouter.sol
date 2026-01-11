// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OracleRouter
 * @notice Entry point for all verification requests
 * @dev Users submit asset verification requests here
 */
contract OracleRouter is Ownable, ReentrancyGuard {
    
    // Enums   
    enum RequestStatus { PENDING, PROCESSING, VERIFIED, REJECTED }
    enum AssetType { REAL_ESTATE, INVOICE, VEHICLE, ART, COMMODITY, OTHER }
    
    // Structs
    struct VerificationRequest {
        uint256 requestId;
        address owner;
        AssetType assetType;
        string location;
        string[] ipfsHashes;
        RequestStatus status;
        uint256 timestamp;
        uint256 valuation;
        uint256 confidence;
    }
    
    // State variables
    uint256 private requestCounter;
    mapping(uint256 => VerificationRequest) public requests;
    mapping(address => uint256[]) public userRequests;
    mapping(address => bool) public authorizedOracles;
    
    address public consensusEngine;
    uint256 public verificationFee = 0.01 ether;
    
    // Events
    event VerificationRequested(
        uint256 indexed requestId,
        address indexed owner,
        AssetType assetType,
        string location,
        string[] ipfsHashes,
        uint256 timestamp
    );
    
    event VerificationCompleted(
        uint256 indexed requestId,
        uint256 valuation,
        uint256 confidence,
        RequestStatus status
    );
    
    event OracleAuthorized(address indexed oracle);
    event OracleRevoked(address indexed oracle);
    
    // Modifiers
    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender], "Not authorized oracle");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        requestCounter = 0;
    }
    
    /**
     * @notice Submit a new verification request
     * @param _assetType Type of asset to verify
     * @param _location Location or address of asset
     * @param _ipfsHashes Array of IPFS hashes for documents
     */
    function requestVerification(
        AssetType _assetType,
        string memory _location,
        string[] memory _ipfsHashes
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= verificationFee, "Insufficient fee");
        require(_ipfsHashes.length > 0, "No documents provided");
        require(bytes(_location).length > 0, "Location required");
        
        uint256 requestId = ++requestCounter;
        
        VerificationRequest storage request = requests[requestId];
        request.requestId = requestId;
        request.owner = msg.sender;
        request.assetType = _assetType;
        request.location = _location;
        request.ipfsHashes = _ipfsHashes;
        request.status = RequestStatus.PENDING;
        request.timestamp = block.timestamp;
        
        userRequests[msg.sender].push(requestId);
        
        emit VerificationRequested(
            requestId,
            msg.sender,
            _assetType,
            _location,
            _ipfsHashes,
            block.timestamp
        );
        
        return requestId;
    }
    
    /**
     * @notice Oracle submits verification result
     * @param _requestId Request ID
     * @param _valuation Asset valuation
     * @param _confidence Confidence score (0-100)
     */
    function submitVerification(
        uint256 _requestId,
        uint256 _valuation,
        uint256 _confidence
    ) external onlyAuthorizedOracle {
        VerificationRequest storage request = requests[_requestId];
        require(request.status == RequestStatus.PENDING, "Request not pending");
        require(_confidence > 0 && _confidence <= 100, "Invalid confidence");
        
        request.valuation = _valuation;
        request.confidence = _confidence;
        request.status = RequestStatus.VERIFIED;
        
        emit VerificationCompleted(_requestId, _valuation, _confidence, RequestStatus.VERIFIED);
    }
    
    /**
     * @notice Get request details
     */
    function getRequest(uint256 _requestId) external view returns (VerificationRequest memory) {
        return requests[_requestId];
    }
    
    /**
     * @notice Get all requests by user
     */
    function getUserRequests(address _user) external view returns (uint256[] memory) {
        return userRequests[_user];
    }
    
    /**
     * @notice Authorize oracle
     */
    function authorizeOracle(address _oracle) external onlyOwner {
        authorizedOracles[_oracle] = true;
        emit OracleAuthorized(_oracle);
    }
    
    /**
     * @notice Revoke oracle authorization
     */
    function revokeOracle(address _oracle) external onlyOwner {
        authorizedOracles[_oracle] = false;
        emit OracleRevoked(_oracle);
    }
    
    /**
     * @notice Set consensus engine address
     */
    function setConsensusEngine(address _consensusEngine) external onlyOwner {
        consensusEngine = _consensusEngine;
    }
    
    /**
     * @notice Update verification fee
     */
    function setVerificationFee(uint256 _fee) external onlyOwner {
        verificationFee = _fee;
    }
    
    /**
     * @notice Withdraw fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
}