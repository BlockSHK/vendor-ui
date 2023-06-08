import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import microsoftImage from "./images/microsoft.webp";
import oracleImage from "./images/oracle.webp";
import adobeImage from "./images/adobe.png";
import backgroundImage from "./images/background_1.jpg";
import { Link as RouterLink } from "react-router-dom";

const NavLink = styled(Link)(({ theme }) => ({
  margin: theme.spacing(1),
  color: "#ffffff",
}));

const BackgroundImage = styled("div")({
  backgroundImage: `url(${backgroundImage})`,
  height: "60vh",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  fontSize: "4em",
  textAlign: "center",
});

export default function Home() {
  return (
    <div>
      <BackgroundImage>BlockSHK Smart License Management</BackgroundImage>
      <Container maxWidth="lg">
        <Box py={5} textAlign="center">
          <Typography variant="h2" gutterBottom>
            Empower Your Licensing with Blockchain
          </Typography>
          <Typography variant="h5" gutterBottom>
            Create and deploy secure, immutable, and transparent software
            licenses on the blockchain.
          </Typography>
          <Typography variant="body1" gutterBottom>
            BlockSHK harnesses blockchain technology to revolutionize software
            license management. Create and deploy licenses as smart contracts,
            ensuring security, transparency, and full control over the licensing
            process. Say goodbye to license duplication and tampering.
          </Typography>
          <Box mt={3}>
            <NavLink component={RouterLink} to="/vendor-ui/create-license">
              <Button variant="contained" color="primary" size="large">
                Create License
              </Button>
            </NavLink>
          </Box>
        </Box>
        <Box py={5}>
          <Typography variant="h4" gutterBottom>
            Trusted by Industry Leaders
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={microsoftImage}
                  alt="Microsoft"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Microsoft
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Microsoft relies on BlockSHK for blockchain-enabled
                    licensing. Streamline the management, deployment, and
                    transfer of Microsoft software licenses with the power of
                    blockchain technology.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={adobeImage}
                  alt="Adobe"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Adobe
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Adobe trusts BlockSHK to secure its creative software
                    licenses. Experience the seamless creation and deployment of
                    Adobe licenses through smart contracts on the blockchain.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={oracleImage}
                  alt="Oracle"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Oracle
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Oracle partners with BlockSHK for efficient license
                    management. Use blockchain-powered smart contracts to manage
                    database and middleware licenses with unmatched security and
                    integrity.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}
