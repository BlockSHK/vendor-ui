import React, { Component } from "react";
import axios from "axios";
import { ethers } from "ethers";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  CircularProgress,
} from "@mui/material";

class MyLicense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      licenses: [],
      error: null,
      openDialog: false,
      licenseDetail: null,
      loading: true,
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
      this.setState({
        licenses: response.data.payload.records,
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({ error: error.message, licenses: [], loading: false });
    }
  };

  handleOpenLicenseDetail = (license) => {
    this.setState({ licenseDetail: license, openDialog: true });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false, licenseDetail: null });
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
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => this.handleOpenLicenseDetail(license)}
            >
              View
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ));
  };

  renderLicenseDetailDialog = (license) => {
    return (
      <Dialog open={this.state.openDialog} onClose={this.handleCloseDialog}>
        <DialogTitle>{license ? license.name : ""}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Software ID: {license ? license.software : ""}
          </DialogContentText>
          <DialogContentText>
            Type: {license ? license.type : ""}
          </DialogContentText>
          <DialogContentText>
            Description: {license ? license.description : ""}
          </DialogContentText>
          <DialogContentText>
            Price: {license ? license.price : ""}
          </DialogContentText>
          <DialogContentText>
            Status: {license ? license.status : ""}
          </DialogContentText>
          <DialogContentText>
            Company: {license ? license.company : ""}
          </DialogContentText>
          <DialogContentText>
            Owner: {license ? license.owner : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderLicenseCategory = (licenses, category) => {
    return (
      <Paper style={{ margin: "16px", padding: "16px" }}>
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
      </Paper>
    );
  };

  render() {
    const { licenses, error, loading } = this.state;

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
      <Box
        style={{
          backgroundImage: 'url("/path/to/your/background.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="md">
          {loading ? (
            <Box display="flex" justifyContent="center" mt={5}>
              <CircularProgress />
            </Box>
          ) : (
            <React.Fragment>
              <Paper style={{ margin: "16px", padding: "16px" }}>
                <Typography variant="h4" align="center" gutterBottom>
                  My Licenses
                </Typography>
              </Paper>

              {this.renderLicenseCategory(perpetualLicenses, "Perpetual")}
              {this.renderLicenseCategory(fixedLicenses, "Fixed Subscription")}
              {this.renderLicenseCategory(
                autoRenewLicenses,
                "Auto Renew Subscription"
              )}

              {error && (
                <Paper style={{ margin: "16px", padding: "16px" }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Error
                  </Typography>
                  <Typography variant="body2" align="center">
                    {error}
                  </Typography>
                </Paper>
              )}

              {this.renderLicenseDetailDialog(this.state.licenseDetail)}
            </React.Fragment>
          )}
        </Container>
      </Box>
    );
  }
}

export default MyLicense;
