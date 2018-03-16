import React, { Component, Fragment } from 'react';
import { Inspector } from 'react-inspector';
import { List } from 'react-content-loader';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/php/php';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';
import Icons from '../icons';
import './style.scss';

/**
 * Main App component for plugin
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {
	constructor() {
		super( ...arguments );
		this.onArgsChange = this.onArgsChange.bind( this );
		this.onQueryExecute = this.onQueryExecute.bind( this );
		this.onTypeChange = this.onTypeChange.bind( this );
		this.state = {
			args: '',
			type: 'WP_Query',
			executing: false,
			error: false,
			message: '',
			result: undefined,
		};
	}

	onArgsChange( newArgs ) {
		this.setState( {
			args: newArgs,
		} );
	}

	onTypeChange( event ) {
		this.setState( {
			type: event.target.value,
		} );
	}

	onQueryExecute() {
		this.setState( {
			executing: true,
		} );

		const url = `${ wpApiSettings.root }wqc/v1/query`;
		// The data we are going to send in our request
		const data = {
			queryArgs: this.state.args,
			queryType: this.state.type,
		};

		// The parameters we are gonna pass to the fetch function
		const fetchData = {
			method: 'POST',
			body: JSON.stringify( data ),
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': wqcRestApi.nonce,
			},
			credentials: 'include',
		};

		fetch( url, fetchData )
			.then( ( response ) => response.json() )
			.then( ( response ) => {
				this.setState( {
					result: ( response.status === 'success' ? JSON.parse( response.data ) : undefined ),
					executing: false,
					error: ( response.status === 'error' ? true : false ),
					message: response.message,
				} );
			} )
			.catch( () => {
				this.setState( {
					error: true,
					executing: false,
					message: 'Unable to process the request',
				} );
			} );
	}

	render() {
		const editorOptions = {
			lineNumbers: true,
			mode: 'text/x-php',
			theme: 'mdn-like',
		};

		let resultUI;

		if ( this.state.executing ) {
			resultUI = <List width="600" height="100" />;
		} else if ( ! this.state.executing && this.state.result !== undefined ) {
			resultUI = <Inspector data={ this.state.result } expandLevel={ 2 } />;
		} else if ( this.state.error ) {
			resultUI = <div id="no-data">
				{ Icons.ask }
				<h2>{ this.state.message }</h2>
			</div>;
		} else {
			resultUI = <div id="no-data">

				{ Icons.invalid }
				<h2>Whats your query ?</h2>
			</div>;
		}

		return (
			<Fragment>
				<h1>WP Query Console</h1>

				<CodeMirror id="queryArgs" value={ this.state.args } onChange={ this.onArgsChange } options={ editorOptions } />

				<span id="wpqc-type-label">Query Type</span>

				<select id="wpqc-query-type" onChange={ this.onTypeChange } name="wpqc-query-type">
					<option value="WP_Query">WP_Query</option>
					<option value="WP_User_Query">WP_User_Query</option>
					<option value="WP_Comment_Query"> WP_Comment_Query</option >
					<option value="WP_Term_Query"> WP_Term_Query</option >
					<option value="WP_Network_Query"> WP_Network_Query</option >
					<option value="WP_Site_Query"> WP_Site_Query</option >
				</select >

				<button id="wpqc-btn-execute" className="button button-primary" onClick={ this.onQueryExecute } type="submit" name="execute">
					<i className="dashicons dashicons-controls-play"></i> Execute
				</button>

				<div id="lwqc_query_result" className="welcome-panel">
					<div className="welcome-panel-content">
						{ resultUI }
					</div>
				</div>
			</Fragment>
		);
	}
}

export default App;
