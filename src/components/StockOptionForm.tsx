import React, { useState } from 'react';
import { useDispatch, useSelector } from '../store';
import { fetchStockOptionsByTicker, addStockOptionToPortfolio } from '../slices/stockOptionSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Form, Button, Modal, Pagination } from 'react-bootstrap';
import { RootState } from '../store';

type PositionType = 'long' | 'short';
type OptionType = 'call' | 'put';

interface StockOption {
  id: number;
  stockOption: string;
  strikePrice: string;
  expirationDate: string;
  optionType: OptionType;
  marketPrice: number;
  impliedVolatility?: number;
}

const TickerSearchComponent: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const dispatch = useDispatch();
  const { stockOptions, loading, error } = useSelector((state: RootState) => state.ticker);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<StockOption | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [position, setPosition] = useState<PositionType>('long');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSearch = () => {
    dispatch(fetchStockOptionsByTicker({ stockOption: ticker, startDate, endDate }));
  };

  const handleOpenAddDialog = (option: StockOption) => {
    setSelectedOption(option);
    setShowAddDialog(true);
  };

  const handleAddToPortfolio = () => {
    if (selectedOption) {
      const data = {
        username: 'test',
        stockOption: {
          tickerSymbol: selectedOption.stockOption,
          strikePrice: selectedOption.strikePrice,
          expirationDate: selectedOption.expirationDate,
          optionType: selectedOption.optionType,
          marketPrice: Number(selectedOption.marketPrice),
          impliedVolatility: Number(selectedOption.impliedVolatility) || 0
        },
        position,
        quantity,
      };

      dispatch(addStockOptionToPortfolio(data))
        .then(() => setShowAddDialog(false))
        .catch((error) => console.error('Error adding to portfolio:', error));
    } else {
      console.error('No option selected');
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const fetchPageNumbers = () => {
    const totalPages = Math.ceil(stockOptions.length / itemsPerPage);
    const totalNumbers = pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;
  
    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages: (number | string)[] = [];
  
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
  
      pages.push(totalPages);
      return pages;
    }
  
    return range(1, totalPages);
  };
  
  
  const range = (from: number, to: number, step = 1): number[] => {
    let i = from;
    const range = [];
  
    while (i <= to) {
      range.push(i);
      i += step;
    }
  
    return range;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = stockOptions.slice(indexOfFirstItem, indexOfLastItem);
  const [pageNeighbours] = useState(2); 
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(stockOptions.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex flex-column align-items-center my-3">
      <Form>
        <Form.Group>
          <Form.Control 
            type="text"
            value={ticker} 
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker symbol"
          />
        </Form.Group>
        <Button variant="primary" onClick={handleSearch}>Search</Button>
      </Form>
      <Form.Group>
  <Form.Label>Start Date</Form.Label>
  <Form.Control 
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />
</Form.Group>
<Form.Group>
  <Form.Label>End Date</Form.Label>
  <Form.Control 
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />
</Form.Group>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <Table striped bordered hover  className="mx-auto">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Strike Price</th>
            <th>Expiration Date</th>
            <th>Type</th>
            <th>Market Price</th>
          </tr>
        </thead>
        <tbody>
  {currentItems.map((option) => {
    const marketPrice = option.marketPrice ? Number(option.marketPrice) : 0; 

    return (
      <tr key={option.id}>
        <td>{option.stockOption}</td>
        <td>{option.strikePrice}</td>
        <td>{new Date(option.expirationDate).toLocaleDateString()}</td>
        <td>{option.optionType}</td>
        <td>{marketPrice || 'N/A'}</td>
        <td>
          <Button
            variant="success"
            onClick={() => handleOpenAddDialog({...option, marketPrice})} 
          >
            Add
          </Button>
        </td>
      </tr>
    );
  })}
</tbody>
      </Table>
      <div className="d-flex justify-content-center my-3">
      <Pagination>
    {fetchPageNumbers().map((page, index) => {
      if (page === '...') {
        return <Pagination.Ellipsis key={index} disabled />;
      }
      return (
        <Pagination.Item 
          key={index} 
          active={page === currentPage} 
          onClick={() => page !== '...' && handlePageChange(page as number)}>
          {page}
        </Pagination.Item>
      );
    })}
  </Pagination>
  </div>
      <Modal show={showAddDialog} onHide={() => setShowAddDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Stock Option to Portfolio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Position</Form.Label>
            <Form.Control
              as="select"
              value={position}
              onChange={(e) => setPosition(e.target.value as PositionType)}
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddToPortfolio}>
            Add to Portfolio
          </Button>
          <Button variant="secondary" onClick={() => setShowAddDialog(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TickerSearchComponent;
