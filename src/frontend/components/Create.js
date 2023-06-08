import React, { Component } from "react";
import { Grid } from "@mui/material";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { utils } from "ethers";

const INFURA_ID = "2QSqx8RXM2BuNuWHMXV67dEfP08";
const INFURA_SECRET_KEY = "041da3f3de9aff368b13e103f8fec4a7";

const auth = "Basic " + btoa(INFURA_ID + ":" + INFURA_SECRET_KEY);

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: "",
      description: "",
      image: "",
      name: "",
      owner: "",
      price: "",
      priceUnit: "wei",
      metadata: "",
      software: "",
      status: "ACTIVE",
      type: "",
      subscriptionPeriod: "",
      paymentToken: "",
      response: null,
      error: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.uploadToIPFS = this.uploadToIPFS.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async uploadToIPFS(event) {
    const file = event.target.files[0];
    const data = new FormData();
    data.append("file", file);
    try {
      const result = await axios.post(
        "https://ipfs.infura.io:5001/api/v0/add",
        data,
        {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            Authorization: auth,
          },
        }
      );
      console.log(result);
      this.setState({
        metadata: `https://ipfs.io/ipfs/${result.data.Hash}`,
      });
    } catch (error) {
      console.error("Upload to IPFS failed:", error);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    let data = { ...this.state };
    delete data.response;
    delete data.error;

    if (
      data.type === "CONTRACT_FIXED_SUBSCRIPTION" ||
      data.type === "CONTRACT_PERPETUAL"
    ) {
      let priceInWei;
      switch (data.priceUnit) {
        case "wei":
          priceInWei = data.price;
          break;
        case "gwei":
          priceInWei = utils.parseUnits(data.price, "gwei");
          break;
        case "eth":
          priceInWei = utils.parseEther(data.price);
          break;
        default:
          priceInWei = data.price;
      }
      data.price = priceInWei;
    }

    try {
      const response = await axios.post(
        "https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/create",
        data
      );
      this.setState({ response: response.data, error: null });
    } catch (error) {
      this.setState({ error: error.message, response: null });
    }
  }

  render() {
    const { response, error, type, priceUnit } = this.state;

    return (
      <Box
        component="form"
        onSubmit={this.handleSubmit}
        noValidate
        autoComplete="off"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "50%",
          margin: "0 auto",
          boxSizing: "border-box",
          padding: "1em",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Create License
        </Typography>
        <TextField
          label="Company"
          name="company"
          onChange={this.handleChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          onChange={this.handleChange}
          fullWidth
        />
        <TextField
          label="Image URL"
          name="image"
          onChange={this.handleChange}
          fullWidth
        />
        <TextField
          label="Name"
          name="name"
          onChange={this.handleChange}
          fullWidth
        />
        <TextField
          label="Owner"
          name="owner"
          onChange={this.handleChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            value={type}
            label="Type"
            name="type"
            onChange={this.handleChange}
          >
            <MenuItem value={"CONTRACT_PERPETUAL"}>Perpetual License</MenuItem>
            <MenuItem value={"CONTRACT_FIXED_SUBSCRIPTION"}>
              Fixed Subscription
            </MenuItem>
            <MenuItem value={"CONTRACT_AUTO_RENEW_SUBSCRIPTION"}>
              Auto Renew Subscription
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Price"
          name="price"
          onChange={this.handleChange}
          fullWidth
        />
        {(type === "CONTRACT_FIXED_SUBSCRIPTION" ||
          type === "CONTRACT_PERPETUAL") && (
          <FormControl fullWidth>
            <InputLabel id="priceUnit-label">Price Unit</InputLabel>
            <Select
              labelId="priceUnit-label"
              value={priceUnit}
              label="Price Unit"
              name="priceUnit"
              onChange={this.handleChange}
            >
              <MenuItem value="wei">wei</MenuItem>
              <MenuItem value="gwei">gwei</MenuItem>
              <MenuItem value="eth">eth</MenuItem>
            </Select>
          </FormControl>
        )}
        {(type === "CONTRACT_AUTO_RENEW_SUBSCRIPTION" ||
          type === "CONTRACT_FIXED_SUBSCRIPTION") && (
          <TextField
            label="Subscription Period"
            name="subscriptionPeriod"
            onChange={this.handleChange}
            fullWidth
          />
        )}
        {type === "CONTRACT_AUTO_RENEW_SUBSCRIPTION" && (
          <FormControl fullWidth>
            <InputLabel id="paymentToken-label">Payment Token</InputLabel>
            <Select
              labelId="paymentToken-label"
              label="Payment Token"
              name="paymentToken"
              value={this.state.paymentToken}
              onChange={this.handleChange}
            >
              <MenuItem value={"0x3424FfB2222C88F8bD7EB0179c483623cf05a4F9"}>
                MapCoin
              </MenuItem>
            </Select>
          </FormControl>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              disabled
              label="Metadata"
              value={this.state.metadata}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              accept="*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={this.uploadToIPFS}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Upload Metadata
              </Button>
            </label>
          </Grid>
        </Grid>
        <TextField
          label="Software"
          name="software"
          onChange={this.handleChange}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
        {response && (
          <div>
            <h2>Response:</h2>
            <p>{JSON.stringify(response, null, 2)}</p>
          </div>
        )}
        {error && (
          <div>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </Box>
    );
  }
}
