import React, {Component} from "react";
import './BidItem.css';
import Table from "../Bids_Table/Table";
class BidItem extends Component{

    constructor(props){
        super(props)
        this.state={
            bid_placed :0
        }
    }
    render(props){
        const onSubmitHandler = (event) =>
        {   
            event.preventDefault();
            this.props.onBidPlaced(this.state.bid_placed); // send amount back to Main.js
            this.setState({bid_placed:0});
        }
        const onBidPlacedHandler = (event) =>{

            this.setState({bid_placed: event.target.value });
        }
        return(
            <div>
                <div className="Main-Container">
                <p>BID ITEM</p>
                    <div className="BID">
                        <img src={this.props.img} width="250" height="150px"/> 
                        <form onSubmit={onSubmitHandler} className="FORM">
                            <input type="number"  value ={this.state.bid_placed} step="0.01" min="0.01" onChange={onBidPlacedHandler}/>
                            <button type="submit"> Place Bid </button>
                        </form>
                        <Table
                         onBidPlaced= {onBidPlacedHandler} 
                         highestBid = {this.props.highestBid}
                         highestBidder = {this.props.highestBidder}
                         lowestBid = {this.props.lowestBid}
                         lowestBidder=  {this.props.lowestBidder}
                        />
                    </div>
                </div>

               
            </div>
        );
    };
}
export default BidItem