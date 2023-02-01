import React, {Component} from 'react';
import { useEffect } from 'react';
import './App.css';
import Main from './Main';
import Web3 from "web3";
import Auction from '../truffle_abis/Auction.json';


class App extends Component {

  /* LOAD WEB 3 */
    async UNSAFE_componentWillMount(){
      await this.LoadWeb3();
      await this.LoadBlockChain();
      await this.GetBids_Data();
    }

   
  async LoadWeb3(){
    if(window.ethereum)
    {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3)
    {
      window.web3 = new Web3 (window.web3.currentProvider)
    }
    else{
      window.alert('No Wallet Detected');
    }
  }

  async LoadBlockChain(){
    const web3 = window.web3
    const account = await web3.eth.getAccounts(); // getting account that is connected
    this.setState({connected_account:account});

    //Ganache Network ID
    const networkID = await web3.eth.net.getId();

    //Loading Contract
    const ContractData = Auction.networks[networkID];

    if(ContractData){
      const cont = new web3.eth.Contract(Auction.abi,ContractData.address);
      // Set contract to state here
      this.setState({auction_contract: cont});
      this.GetAuctionOwner();
     

    }
    this.setState({loading:false});
  }

  componentDidUpdate(prevProps,prevState){
    if (prevState.Timer != this.state.Timer)
      { 
        const new_v = this.state.Timer;
        new_v >= 0 ?  localStorage.setItem('Timer' , String(new_v)) : localStorage.setItem('Timer' , String(30));
        
        this.UpdateTimer();
        
      }
    }

  UpdateTimer = () =>{
    const getTimerFromLocalStorage = Number(localStorage.getItem('Timer'));
    
    Number.isInteger(getTimerFromLocalStorage)? this.setState({Timer: getTimerFromLocalStorage}) : 
      this.setState({Timer:30})
  }
    PlaceBid = async (amount)=>{
        const amount_wei = await Web3.utils.toWei(amount,'ether');
        if(amount_wei > this.state.curr_amount)
        {
          await this.state.auction_contract.methods.Bid(amount_wei).send({
            from:this.state.connected_account.toString(),
            value: amount_wei
          }).on('transactionHash',(hash)=>{});
              
          this.GetBids_Data();
        }
        else{
          window.alert('Bid Amount is Low then the Current Highest');
        }
      }
     SendEth_ToOwner = async()=>{
      if(this.state.connected_account == this.state.auction_owner)
      {
        await this.state.auction_contract.methods.TransferEthToOwner().send({from:this.state.connected_account.toString()});
      }
      else{
        window.alert("Only Auction Owner Can Claim");
      }
    }

    GetBids_Data = async()=>{
       // Getting Bids (Later Place them in seperate Function) 
       const highbid = await this.state.auction_contract.methods.getCurrentHighestBid().call();
       const amount_eth1 = await Web3.utils.fromWei(highbid[1],'ether');
       this.setState({curr_addr:highbid[0]})
       this.setState({curr_amount:amount_eth1})

       const prevBid = await this.state.auction_contract.methods.getPrevHighestBid().call();
       const amount_eth2 = await Web3.utils.fromWei(prevBid[1],'ether');
       this.setState({prev_addr:prevBid[0]})
       this.setState({prev_amount:amount_eth2})
       
       console.log("Highest Bidder: " , this.state.curr_addr , "Highest Bid: " , this.state.curr_amount);
       console.log("Prev Bidder: " , this.state.prev_addr , "Prev Bid: " , this.state.prev_amount );
    }

     GetContract_Balance = async () =>{
      const cont_bal = await this.state.auction_contract.methods.getContractBalance().call();
      console.log("Contract Balance: " , cont_bal);
    }
      GetRefundForCustomers = async()=>{
        if(this.state.connected_account != this.state.auction_owner)
        {
            await this.state.auction_contract.methods.GetRefund().send({from:this.state.connected_account.toString()});
        }
        else{
          window.alert('Owner Can not Initate Refund');
        }
      }
    async GetAuctionOwner(){
    const addr = await this.state.auction_contract.methods.GetOwner().call();
    this.setState({auction_owner:addr});
    }



  constructor(props){
    super(props)
    this.state = {
      auction_owner:'0x0',
      connected_account:'0x000',
      bid_placed:0,
      prev_addr:'0x0000000000000',
      curr_addr:'0x0000000000000',
      prev_amount:'0',
      curr_amount:'0',
      loading : true,
      Timer : Number(localStorage.getItem('Timer')),
      auction_contract : {}

    };
    
  }
  render(){

    const onBidPlaced = (amount)=>{
      this.setState({bid_placed:amount}); // received Bid from Main.js
      this.PlaceBid(amount);
      //console.log("STATE: " , this.state.bid_placed) 
      console.log("REC: " , amount)
    }

    const onTimerChange = (newTimer) =>{ // Recieving Update Timer value from Main.js 
      this.setState({Timer: newTimer});
    }

    let Content_Can_LoadNow
    { this.state.loading? Content_Can_LoadNow = <h1><strong>Connecting Wallet and Loading Contract Data... </strong></h1>
      :
      Content_Can_LoadNow = 
      <Main 
      auction_owner = {this.state.auction_owner} 
      connected_account ={this.state.connected_account}
      onBidPlaced = {onBidPlaced}
      Timer = {this.state.Timer}
      onTimerChange = {onTimerChange}
      highestBid = {this.state.curr_amount}
      highestBidder = {this.state.curr_addr}
      lowestBid = {this.state.prev_amount}
      lowestBidder=  {this.state.prev_addr}
      />
    }
    let WithDraw_Options
    {
        this.state.Timer != Number(0) ? WithDraw_Options= <p><strong>Transfer And Withdraw Options Would be available after the Auction has ended
        </strong></p> :
        WithDraw_Options = 
        <>
        <button onClick={this.SendEth_ToOwner}>Claim Bid</button>,
        <button onClick={this.GetContract_Balance}>View Contract Balance</button>
        <button onClick={this.GetRefundForCustomers}>Get Refund</button>
        </>
    }
    
    return (
      <div>
        {Content_Can_LoadNow}
          <div className='Footer'>
            {WithDraw_Options}
          </div>
      </div>
      
    );
    
  }
}

export default App;
