import React, { Component } from "react";
import axios from "axios";

export default class UpdateLicense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      response: null,
      error: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
  }
  async handleSubmit(event) {
    event.preventDefault();
    const { address } = this.state;
    try {
      const response = await axios.post(
        "https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/activation/nonce",
        { address }
      );
      this.setState({ response: response.data, error: null });
    } catch (error) {
      this.setState({ error: error.message, response: null });
    }
  }

  render() {
    const { response, error } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            onChange={this.handleChange}
            value={this.state.address}
          />
          <button type="submit">Send</button>
        </form>
        {response && (
          <div>
            <h2>Response:</h2>
            <p>Status: {response.status}</p>
            <p>Nonce: {response.payload.nonce}</p>
            <p>Address: {response.payload.address}</p>
            <p>Timestamp: {response.payload.timestamp}</p>
          </div>
        )}
        {error && (
          <div>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
}
