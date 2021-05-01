import React, { Component } from 'react'
import './nav.css'

class Nav extends React.PureComponent{
    constructor( props ){
        super( props )

    }

    // Each of these notification icons/controls should probably be their own Component where data gets sent to display the badges for notification totals etc.
    render(){
        return (
            <nav className="navbar navbar-icon-top navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand ms-2" href="#">Scintillator</a>
                    <button className="navbar-toggler me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navBarSupportedContent" aria-controls="navBarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navBarSupportedContent">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">
                                    <i className="fa fa-home"></i>
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <i className="fa fa-envelope-o">
                                        <span className="badge bg-success">11</span>
                                    </i>
                                    Notifications
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <i className="fa fa-bell-o">
                                        <span className="badge bg-warning">2</span>
                                    </i>
                                    Alerts
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    <i className="fa fa-users">
                                        <span className="badge bg-info ">!</span>
                                    </i>
                                    Organization
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Nav