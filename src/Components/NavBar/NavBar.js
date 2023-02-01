import React,{Component} from "react";
import './NavBar.css';

class NavBar extends Component{
    render(props){
        return(
            <div>
                <div className="Owner">
                    <div className="Owner-details">
                        <p> <span>OWNER</span></p>
                        <p> <span>{this.props.auction_owner}</span></p>
                    </div>
                </div>

                <div className="Bidder">
                    <div className="Bidder-details">
                    <p>Bidder</p>
                    <p>{this.props.connected_account}</p>
                    </div>    
                </div>
            </div>
        );
    };
}

export default NavBar;