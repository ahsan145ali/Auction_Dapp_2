import React,{Component} from 'react';
import {useState} from 'react';
import './Table.css'
class Table extends Component{
    constructor(props){
        super(props)
        this.state = {
            highBidder: 0
        }
    }
    render(props){
        return(
            <>
                <div className="Main-Table-container">
                    <table className="Table">
                        <thead className="Table-Header">    
                            <tr className='row-head'>
                                <th>#</th>
                                <th>Bidder</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody className="Table-Body">
                            <tr className="row1">
                                <td>Highest Bid</td>
                                <td>{this.props.highestBidder}</td>
                                <td>{this.props.highestBid} eth</td>
                            </tr>

                            <tr className="row2">
                                <td>Prev Highest Bid</td>
                                <td>{this.props.lowestBidder}</td>
                                <td>{this.props.lowestBid} eth</td>
                            </tr>
                            
                        </tbody>
                        
                    </table>
                    
                </div>
            </>
        );
    }
}

export default Table;