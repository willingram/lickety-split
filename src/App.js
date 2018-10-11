import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import Auth from '@aws-amplify/auth';
// import Analytics from '@aws-amplify/analytics';
// import { Api, graphqlOperation } from '@aws-amplify/api';
import { listTodos } from './graphql/queries';
import { createTodo } from './graphql/mutations';
import awsconfig from './aws-exports';
import { API, graphqlOperation, Auth, Analytics } from 'aws-amplify';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);
// config api
API.configure(awsconfig);

class App extends Component {
  constructor(props) {
    super(props);
    this.handleAnalyticsClick = this.handleAnalyticsClick.bind(this);
    this.state = { analyticsEventSent: false, resultHtml: '', eventsSent: 0 };
  }

  handleAnalyticsClick() {
    Analytics.record('AWS Amplify Tutorial Event').then(evt => {
      const url =
        'https://console.aws.amazon.com/pinpoint/home/?region=us-east-1#/apps/' +
        awsconfig.aws_mobile_analytics_app_id +
        '/analytics/events';
      let result = (
        <div>
          <p>Event Submitted.</p>
          <p>Events sent: {++this.state.eventsSent}</p>
          <a href={url} target="_blank">
            View Events on the Amazon Pinpoint Console
          </a>
        </div>
      );
      this.setState({
        analyticsEventSent: true,
        resultHtml: result,
      });
    });
  }

  listQuery = async () => {
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    console.log(allTodos);
    this.setState({ resultHtml: JSON.stringify(allTodos) });
  };

  createMutation = async () => {
    const todoDetails = {
      input: {
        name: 'Party tonight!',
        description: 'Amplify CLI rocks!',
        newProp: 'bob',
      },
    };

    const newEvent = await API.graphql(
      graphqlOperation(createTodo, todoDetails)
    );
    console.log(newEvent);
    this.setState({ resultHtml: JSON.stringify(newEvent) });
  };

  render() {
    return (
      <div className="App">
        <div className="App-intro">
          <button className="App-button" onClick={this.handleAnalyticsClick}>
            Generate Analytics Event
          </button>
          {this.state.analyticsEventSent}
          <button onClick={this.listQuery}>List todos</button>
          <button onClick={this.createMutation}>Create todo</button>
          <div>{this.state.resultHtml}</div>
        </div>
      </div>
    );
  }
}

export default App;
