import React, { Component } from "react";
import axios from "axios";
import { ethers } from "ethers";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Container,
} from "@mui/material";

export default class Deploy extends Component {
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

  deployLicense = async (license) => {
    try {
      license.contract = { blockchain: "ETHEREUM" };
      const response = await axios.post(
        `https://b1r5aq31x2.execute-api.us-east-1.amazonaws.com/Prod/deploy/${license.id}`,
        license
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  renderLicenseCards = (licenses) => {
    const undeployedLicenses = licenses.filter((license) => !license.contract);
    return undeployedLicenses.map((license) => (
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
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => this.deployLicense(license)}
            >
              Deploy License
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ));
  };

  render() {
    const { licenses, error } = this.state;

    return (
      <Container maxWidth="md">
        <Typography variant="h2" align="center" gutterBottom>
          License To Deploy
        </Typography>

        {licenses.length > 0 ? (
          <Grid container spacing={4}>
            {this.renderLicenseCards(licenses)}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" gutterBottom>
            No Licenses
          </Typography>
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
