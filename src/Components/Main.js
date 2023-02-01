import React, {Component} from 'react';
import NavBar from './NavBar/NavBar';
import BidItem from './Bid_Items/BidItem';
import './Main.css';
class Main extends Component{
    render(props){
        const onBidPlacedHandler = (amount) =>{
            this.props.onBidPlaced(amount); // send bid amount back to app.js
        }

        const onClickHandler = ()=>{
            this.props.onTimerChange(this.props.Timer - 1);
        }
    return(
        <div>
            <NavBar auction_owner = {this.props.auction_owner} connected_account={this.props.connected_account}/>
                <div className="Bids-Container">
                    <BidItem 
                    img = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD8sVSnIcgYRHElw3OfuwrFVSH97auNcS3qg&usqp=CAU" 
                            onBidPlaced= {onBidPlacedHandler} 
                            highestBid = {this.props.highestBid}
                            highestBidder = {this.props.highestBidder}
                            lowestBid = {this.props.lowestBid}
                            lowestBidder=  {this.props.lowestBidder}
                            />
                
             </div>


            <div>
                 <h1>Timer: {this.props.Timer}</h1>
                 <button onClick={onClickHandler}> Change Timer </button>
            </div>
        </div>
    );
    }
}

export default Main;