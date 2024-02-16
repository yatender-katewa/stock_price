import React, { useState, useEffect } from "react";
import {
  Container,
  Navbar,
  Form,
  FormControl,
  Button,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const API_KEY = "cn7fo41r01qgjtj4j8lgcn7fo41r01qgjtj4j8m0";
const BASE_URL = "https://finnhub.io/api/v1";

const App = () => {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [news, setNews] = useState([]);
  const [historicalPrices, setHistoricalPrices] = useState([]);

  const [companyInfo, setCompanyInfo] = useState({});

  const fetchStockPrice = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stock price");
      }
      const data = await response.json();
      setPrice(data.c);
    } catch (error) {
      console.error("Error fetching stock price:", error);
    }
  };

  const fetchCompanyNews = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/company-news?symbol=${symbol}&from=2024-02-01&to=2024-02-16&token=${API_KEY}`
      );
      const data = await response.json();
      setNews(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching company news:", error);
    }
  };

  const fetchHistoricalPrices = async () => {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/chart/${symbol}?range=5d&interval=1d`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch historical prices");
      }
      const data = await response.json();
      console.log("Fetched historical prices:", data);

      // Extract data from response (adjust this based on the API response structure)
      const timestamps = data.chart.result[0].timestamp;
      const opens = data.chart.result[0].indicators.quote[0].open;
      const closes = data.chart.result[0].indicators.quote[0].close;

      const last5DaysPrices = timestamps.slice(-5).map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toLocaleDateString(),
        open: opens[index],
        close: closes[index],
      }));

      setHistoricalPrices(last5DaysPrices);
    } catch (error) {
      console.error("Error fetching historical prices:", error);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`
      );
      const data = await response.json();
      setCompanyInfo(data);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStockPrice();
    fetchCompanyNews();
    fetchHistoricalPrices();
    fetchCompanyInfo();
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Stock Tracker</Navbar.Brand>
        </Container>
      </Navbar>

      <Card style={{ width: "18rem" }}>
        <Card.Body>
          {/* <Card.Title>Card Title</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Card Subtitle
          </Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link> */}
          <Form inline onSubmit={handleSubmit}>
            <FormControl
              type="text"
              placeholder="Enter stock symbol"
              className="mr-sm-2"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <Button variant="outline-success" type="submit">
              Search
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Container className="mt-4">
        <h1>Stock Price: {price}</h1>

        <h2>Company News</h2>
        {news.map((item, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{item.headline}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {new Date(item.datetime * 1000).toLocaleString()}
              </Card.Subtitle>
              <Card.Text>{item.summary}</Card.Text>
            </Card.Body>
          </Card>
        ))}

        <h2>Historical Stock Prices</h2>
        <Row>
          {Array.isArray(historicalPrices) &&
            historicalPrices.map((price, index) => (
              <Col key={index} xs={6} md={4} lg={3}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>
                      {new Date(price.t * 1000).toLocaleDateString()}
                    </Card.Title>
                    <Card.Text>
                      Open: {price.o}
                      <br />
                      Close: {price.c}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>

        <h2>Company Information</h2>
        <p>
          <strong>Name:</strong> {companyInfo.name}
        </p>
        <p>
          <strong>Market Cap:</strong> {companyInfo.marketCapitalization}
        </p>
        <p>
          <strong>Industry:</strong> {companyInfo.finnhubIndustry}
        </p>
      </Container>

      <footer className="bg-dark text-white text-center py-3">
        <Container>
          <p>&copy; 2024 Stock Tracker. All rights reserved.</p>
        </Container>
      </footer>
    </>
  );
};

export default App;
