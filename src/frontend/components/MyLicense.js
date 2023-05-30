import React, { Component } from "react";
import axios from "axios";
import { ethers } from "ethers";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Container,
} from "@mui/material";

export default class MyLicense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      licenses: [],
      error: null,
    };

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
  }

  componentDidMount() {
    this.fetchLicenses();
  }

  fetchLicenses = async () => {
    try {
      const owner = await this.signer.getAddress();
      const response = await axios.post(
        "https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/query/license",
        {
          filter: {
            owner: owner,
          },
        }
      );
      this.setState({ licenses: response.data.payload.records, error: null });
    } catch (error) {
      this.setState({ error: error.message, licenses: [] });
    }
  };

  renderLicenseCards = (licenses) => {
    return licenses.map((license) => (
      <Grid item key={license.id} xs={12} sm={6} md={4}>
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={license.image}
            alt={license.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {license.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Software ID: {license.software}
              <br />
              Type: {license.type}
              <br />
              Description: {license.description}
              <br />
              Price: {license.price}
              <br />
              Status: {license.status}
              <br />
              Company: {license.company}
              <br />
              Owner: {license.owner}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  renderLicenseCategory = (licenses, category) => {
    return (
      <div>
        <Typography variant="h4" align="left" gutterBottom>
          {category} Licenses
        </Typography>
        {licenses.length > 0 ? (
          <Grid container spacing={4}>
            {this.renderLicenseCards(licenses)}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" gutterBottom>
            No {category} Licenses
          </Typography>
        )}
      </div>
    );
  };

  render() {
    const { licenses, error } = this.state;

    const perpetualLicenses = licenses.filter(
      (license) => license.type === "CONTRACT_PERPETUAL"
    );
    const fixedLicenses = licenses.filter(
      (license) => license.type === "CONTRACT_FIXED_SUBSCRIPTION"
    );
    const autoRenewLicenses = licenses.filter(
      (license) => license.type === "CONTRACT_AUTO_RENEW_SUBSCRIPTION"
    );

    return (
      <Container maxWidth="md">
        <Typography variant="h2" align="center" gutterBottom>
          My Licenses
        </Typography>

        {this.renderLicenseCategory(perpetualLicenses, "Perpetual")}
        {this.renderLicenseCategory(fixedLicenses, "Fixed Subscription")}
        {this.renderLicenseCategory(
          autoRenewLicenses,
          "Auto Renew Subscription"
        )}

        {error && (
          <div>
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </Container>
    );
  }
}
