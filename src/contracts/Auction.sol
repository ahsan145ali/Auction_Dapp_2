// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auction{
    address Auction_Owner;
    mapping(address=>uint) bidders;
    mapping(address=>uint) Pending_returns;

    uint highest_bid;
    address highest_Bidder;

    uint prev_higest_bid;
    address prev_higest_bidder;

    uint Creation_time;

    constructor(){
        Auction_Owner = msg.sender; 
        highest_bid = 0;
        prev_higest_bid = 0;
        Creation_time = block.timestamp;
    }

    event BidPlace(
        address CurrentBidder,
        uint Current_BidAmount,
        uint Previous_BidAmount
    );

    event RecievedEth(
        address SentFrom,
        uint EthAmount
    );

    modifier isAuctionEnded(){
        require(block.timestamp > Creation_time + 2 days, 'Auction Not Ended'
        );
        _;
    }

    modifier isOwner(){
        require(msg.sender == Auction_Owner , 'You are not the Owner');
        _;
    }
    receive() external payable{
        //payable(Auction_Owner).transfer(msg.value);
        emit RecievedEth(msg.sender, msg.value);
    }
    function Bid(uint amount) payable public {

        //require(block.timestamp < Creation_time + 2 days,'Auction Time Ended');
        if(amount > highest_bid){
            
            prev_higest_bid = highest_bid;
            prev_higest_bidder = highest_Bidder;

            highest_bid = amount;
            highest_Bidder = msg.sender;

            bidders[msg.sender] = amount;
            Pending_returns[prev_higest_bidder] += prev_higest_bid;
     
            emit BidPlace(highest_Bidder, highest_bid, prev_higest_bid);
        }
        else{
            revert('Amount too Low');
        }
    }

    /* 
        after auction ended bidders who did not placed the highest bid can call for refund  
    */

    /* Add Modifier isAuctionEnded() , removing it now for only test purposes */
    function GetRefund() public payable{ 
        uint amount =  Pending_returns[msg.sender];
        uint contract_balance = address(this).balance;

        require(msg.sender != Auction_Owner , 'Owner can not Initiate Refund');
        require(amount > 0 , 'No Pending Returns');
        require(amount <= contract_balance , 'Not enough Funds In Contract');
        //require(msg.sender != highest_Bidder , 'Auction Winner Can not Claim Refund');

            Pending_returns[msg.sender] = 0;
            payable(msg.sender).transfer(amount);
    }

    /* Send the highest Bid to the Auction Owner*/
    function TransferEthToOwner() public payable isOwner() {
        uint256 contract_balance = address(this).balance ;
        require(highest_bid <= contract_balance , 'Insufficient Amount in Contract');
        payable(Auction_Owner).transfer(highest_bid);
    }
    
    function ShowCurrentBid() external view  returns(address,uint){
        return (highest_Bidder,highest_bid);
    }

    function GetOwner() external view returns(address){
        return Auction_Owner;
    }

    function getCurrentHighestBid() external view returns(address,uint){
        return (highest_Bidder,highest_bid);
    }

    function getPrevHighestBid() external view returns(address,uint){
        return (prev_higest_bidder,prev_higest_bid);
    }
    function getContractBalance() external view returns(uint){
        return address(this).balance;
    }

}