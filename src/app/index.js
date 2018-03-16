import React, { Component, Fragment } from 'react';
import { Inspector } from 'react-inspector';
import { List } from 'react-content-loader';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/php/php';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';
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
				<svg xmlns="http://www.w3.org/2000/svg" style={ { isolation: 'isolate' } }
					viewBox="0 0 87.959 87.959" width="87.959" height="87.959">
					<defs>
						<clippath id="_clipPath_FjlTKPQfXgo5rBKMWrQiM6exgtfij7qL">
							<rect width="87.959" height="87.959" />
						</clippath>
					</defs>
					<g clipPath="url(#_clipPath_FjlTKPQfXgo5rBKMWrQiM6exgtfij7qL)">
						<g id="noun_1603184_cc">
							<path fill="#e74c3c" d="M 43.917 5.808 C 43.241 5.845 42.63 6.222 42.292 6.808 L 0.261 79.152 C -0.095 79.769 -0.096 80.528 0.258 81.146 C 0.612 81.764 1.267 82.147 1.98 82.152 L 85.98 82.152 C 86.692 82.147 87.347 81.764 87.701 81.146 C 88.055 80.528 88.054 79.769 87.698 79.152 L 45.73 6.808 C 45.358 6.164 44.66 5.779 43.917 5.808 Z M 44.011 11.808 L 82.511 78.152 L 5.448 78.152 L 44.011 11.808 Z M 43.98 28.996 C 40.137 28.996 36.98 32.154 36.98 35.996 C 36.976 36.175 36.998 36.354 37.042 36.527 L 42.042 55.496 C 42.269 56.381 43.066 56.999 43.98 56.999 C 44.893 56.999 45.69 56.381 45.917 55.496 L 50.917 36.527 C 50.962 36.354 50.983 36.175 50.98 35.996 C 50.98 32.154 47.822 28.996 43.98 28.996 Z M 43.98 32.996 C 45.62 32.996 46.856 34.279 46.917 35.902 L 43.98 47.121 L 41.042 35.902 C 41.103 34.279 42.339 32.996 43.98 32.996 Z M 43.98 59.996 C 40.137 59.996 36.98 63.154 36.98 66.996 C 36.98 70.838 40.137 73.996 43.98 73.996 C 47.822 73.996 50.98 70.838 50.98 66.996 C 50.98 63.154 47.822 59.996 43.98 59.996 Z M 43.98 63.996 C 45.66 63.996 46.98 65.315 46.98 66.996 C 46.98 68.676 45.66 69.996 43.98 69.996 C 42.299 69.996 40.98 68.676 40.98 66.996 C 40.98 65.315 42.299 63.996 43.98 63.996 Z"
								id="Group" />
						</g>
					</g>
				</svg>
				<h2>{ this.state.message }</h2>
			</div>;
		} else {
			resultUI = <div id="no-data">

				<svg xmlns="http://www.w3.org/2000/svg" style={ { isolation: 'isolate' } }
					viewBox="0 0 102.047 102.047" width="102.047" height="102.047">
					<defs>
						<clippath id="_clipPath_QRy4fgyDmWJA6hdTSYj3HpLvai0Zu218">
							<rect width="102.047" height="102.047" />
						</clippath>
					</defs>
					<g clipPath="url(#_clipPath_QRy4fgyDmWJA6hdTSYj3HpLvai0Zu218)">
						<g id="query">
							<path fill="gray" d="M 63.271 79.439 C 68.55 80.66 73.26 82.9 77.01 85.86 C 81.09 89.089 84.031 93.179 85.33 97.74 C 85.601 98.7 84.87 99.65 83.89 99.65 L 24.28 99.65 C 23.45 99.65 22.78 98.98 22.78 98.15 C 22.78 97.98 22.81 97.81 22.86 97.66 C 24.18 93.12 27.11 89.06 31.17 85.849 C 34.92 82.88 39.64 80.64 44.92 79.429 L 44.92 74.26 C 42.94 73.231 41.14 71.881 39.58 70.281 C 35.85 66.44 33.53 61.151 33.5 55.321 L 33.5 54.871 L 31.12 54.871 C 27.62 54.871 24.75 52.001 24.75 48.501 L 24.75 47.931 C 24.75 44.431 27.62 41.561 31.12 41.561 L 33.44 41.561 L 33.43 40.191 C 32.18 39.701 31.09 38.891 30.26 37.851 C 29.2 36.531 28.56 34.841 28.56 33.021 L 28.56 24.171 C 28.56 24.051 28.56 23.941 28.57 23.821 L 18.16 23.821 C 16.93 23.821 16.24 22.421 16.94 21.441 C 20.22 16.121 25.67 11.521 31.77 8.181 C 38.3 4.61 45.61 2.46 51.82 2.4 C 52.49 2.39 53.12 2.41 53.72 2.45 C 59.17 2.84 64.031 5.1 67.54 8.44 C 69.91 10.7 71.681 13.46 72.601 16.48 C 74.64 16.52 76.49 17.38 77.84 18.75 C 79.22 20.14 80.069 22.06 80.069 24.17 L 80.069 33.02 C 80.069 34.89 79.389 36.62 78.27 37.96 C 77.399 39 76.259 39.81 74.959 40.27 L 74.949 41.55 L 77.549 41.55 C 81.059 41.55 83.919 44.41 83.919 47.92 L 83.919 48.49 C 83.919 51.99 81.049 54.86 77.549 54.86 L 74.81 54.86 L 74.81 55.31 C 74.81 60.81 72.5 66.349 68.67 70.289 C 67.101 71.909 65.28 73.268 63.271 74.3 L 63.271 79.419 L 63.271 79.439 Z M 57.06 49.19 C 57.04 50.81 55.96 52.13 54.64 52.13 L 53 52.13 C 51.68 52.13 50.6 50.81 50.58 49.19 L 57.06 49.19 Z M 59.72 60.16 C 60.8 60.16 61.76 60.68 62.351 61.48 C 62.63 61.4 62.92 61.32 63.22 61.22 C 64.351 60.86 65.56 60.4 66.781 59.81 C 69.121 58.669 70.969 54.78 72.07 50.86 L 72.07 30.86 C 72.07 29.41 71.961 28.08 71.591 26.68 C 71.32 25.66 70.951 24.71 70.481 23.83 L 38.06 23.83 C 37.57 24.71 37.18 25.67 36.9 26.69 C 36.55 27.96 36.37 29.34 36.38 30.84 L 36.49 55.31 C 36.49 56.03 36.54 56.73 36.62 57.429 C 37.11 61.61 38.97 65.36 41.73 68.2 C 42.78 69.28 43.95 70.221 45.23 71 C 47.85 72.6 50.9 73.52 54.149 73.52 C 57.559 73.52 60.739 72.51 63.44 70.76 C 64.559 70.04 65.589 69.18 66.52 68.231 C 68.83 65.86 70.51 62.84 71.3 59.46 C 70.38 60.83 69.31 61.91 68.08 62.51 C 66.729 63.17 65.38 63.68 64.101 64.08 C 63.64 64.23 63.181 64.36 62.74 64.471 C 62.271 65.67 61.09 66.519 59.71 66.519 C 57.92 66.519 56.47 65.099 56.47 63.339 C 56.47 61.579 57.92 60.16 59.71 60.16 L 59.72 60.16 Z M 76.28 44.57 C 75.989 46.29 75.52 48.63 74.84 51.06 L 74.83 51.88 L 77.54 51.88 C 79.399 51.88 80.91 50.36 80.91 48.51 L 80.91 47.94 C 80.91 46.09 79.389 44.57 77.54 44.57 L 76.28 44.57 Z M 31.56 23.83 C 31.55 23.94 31.55 24.06 31.55 24.18 L 31.55 25.97 L 31.55 33.03 C 31.55 34.15 31.94 35.18 32.59 35.98 C 32.83 36.28 33.11 36.55 33.41 36.78 L 33.38 30.85 C 33.37 29.07 33.59 27.42 34.01 25.9 C 34.21 25.18 34.45 24.49 34.73 23.83 L 31.56 23.83 Z M 73.239 22.66 C 73.76 23.67 74.17 24.76 74.479 25.93 C 74.879 27.46 75.08 29.11 75.049 30.89 L 74.988 36.93 C 75.359 36.68 75.689 36.38 75.968 36.04 C 76.648 35.22 77.058 34.17 77.058 33.02 L 77.058 24.17 C 77.058 22.88 76.538 21.7 75.699 20.85 C 75.039 20.18 74.179 19.71 73.219 19.55 C 73.28 20.07 73.309 20.6 73.309 21.13 C 73.309 21.56 73.33 22.24 73.239 22.65 L 73.239 22.66 Z M 53.5 5.45 C 52.92 5.41 52.37 5.39 51.83 5.4 C 46.11 5.46 39.31 7.47 33.19 10.82 C 28.39 13.45 24.03 16.89 20.99 20.83 L 70.31 20.83 C 70.181 17 68.361 13.39 65.46 10.63 C 62.431 7.75 58.23 5.79 53.489 5.46 L 53.5 5.45 Z M 51.12 56.17 L 58.95 56.17 C 60.26 56.17 60.229 58.57 58.95 58.57 L 51.12 58.57 C 49.97 58.57 49.94 56.17 51.12 56.17 Z M 62.38 36.02 L 66.191 35.06 C 68.06 34.59 68.82 37.4 66.911 37.89 L 63.101 38.85 C 61.23 39.32 60.47 36.51 62.39 36.02 L 62.38 36.02 Z M 64.14 41.26 C 62.681 41.26 61.5 42.27 61.5 43.51 C 61.5 43.6 61.51 43.69 61.521 43.78 L 66.75 43.78 C 66.76 43.69 66.771 43.6 66.771 43.51 C 66.771 42.27 65.59 41.26 64.13 41.26 L 64.14 41.26 Z M 45.03 41.21 C 43.57 41.21 42.39 42.22 42.39 43.46 C 42.39 43.55 42.4 43.64 42.41 43.73 L 47.64 43.73 C 47.65 43.64 47.66 43.55 47.66 43.46 C 47.66 42.22 46.48 41.21 45.02 41.21 L 45.03 41.21 Z M 40.98 35.45 L 45 35.45 C 46.97 35.45 47.02 38.44 45 38.44 L 40.98 38.44 C 39.01 38.44 38.96 35.46 40.98 35.45 Z M 47.92 75.519 L 47.92 82.169 C 47.92 83.659 47.86 84.409 49.49 85.55 C 50.64 86.349 52.25 86.849 54.06 86.849 C 55.871 86.849 57.48 86.349 58.63 85.55 C 60.05 84.56 60.26 83.619 60.26 82.179 L 60.26 75.56 C 58.33 76.179 56.281 76.519 54.15 76.519 C 51.981 76.519 49.891 76.169 47.921 75.53 L 47.921 75.519 L 47.92 75.519 Z M 33.48 51.88 L 33.45 44.57 L 31.12 44.57 C 29.26 44.57 27.75 46.09 27.75 47.94 L 27.75 48.51 C 27.75 50.36 29.27 51.88 31.12 51.88 L 33.48 51.88 Z M 44.91 82.51 C 40.33 83.651 36.25 85.631 33.01 88.19 C 30.01 90.571 27.71 93.451 26.38 96.651 L 81.771 96.651 C 80.441 93.461 78.15 90.571 75.15 88.201 C 71.91 85.631 67.84 83.66 63.271 82.519 C 63.22 84.95 62.39 86.599 60.351 88.009 C 58.72 89.14 56.5 89.849 54.07 89.849 C 51.641 89.849 49.421 89.15 47.791 88.009 C 45.991 86.749 44.691 84.78 44.931 82.509 L 44.91 82.509 L 44.91 82.51 Z"
								id="Group" />
						</g>
					</g>
				</svg>
				<h2>Whats your query ?</h2>
			</div>;
		}

		return (
			<Fragment>
				<h3>WP Query Console</h3>

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
