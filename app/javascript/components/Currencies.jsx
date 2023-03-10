import React, { Fragment, useState, useEffect } from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import swal from "sweetalert";
import $ from 'jquery';

const Currencies = (props) => {
  const [state, setState] = useState({
    loaded: false,
    currencies: {},
    cashDeskModal: false,
    exchangeModal: false,
    ratesModal: false,
    cashDesk: {
      currency_id: '',
      amount: '',
      action_type: 'replenishment',
      comment: ''
    },
    exchange: {
      uah_currency_id: '',
      currency_id: '',
      rate: '',
      sell_amount: '',
      amount: '',
      comment: '',
      action_type: 'buy'
    },
    rates: {}
  });

  useEffect(() => {
    let rates = {};
    Object.values(JSON.parse(props.currencies)).map((currency) => {
      if (currency.name !== 'UAH') {
        return rates[currency.id] = {buy_amount: currency.buy, sell_amount: currency.sell, id: currency.id}
      }
    });
    const currency = Object.values(JSON.parse(props.currencies)).filter((currency) => {
      return currency.name !== 'UAH'
    })[0];
    const uah_currency = Object.values(JSON.parse(props.currencies)).filter((currency) => {
      return currency.name === 'UAH'
    })[0];
    const rate = parseFloat(currency.buy);
    setState({
      ...state,
      loaded: true,
      currencies: JSON.parse(props.currencies),
      exchange: {
        ...state.exchange,
        rate: rate,
        currency_id: currency.id,
        uah_currency_id: uah_currency.id
      },
      cashDesk: {
        ...state.cashDesk,
        currency_id: Object.values(JSON.parse(props.currencies))[0].id
      },
      rates: rates
    })
  }, []);

  function handleRatesChange(currency_id, field, value) {
    setState({
      ...state,
      rates: {
        ...state.rates,
        [currency_id]: {
          ...state.rates[currency_id],
          [field]: value
        }
      }
    })
  }

  function cutFloat(value) {
    return (Math.floor(value * 100) / 100);
  }

  function handleExchangeTypeChange(type) {
    let rate = 0;
    if (type === 'sell') {
      rate = state.currencies[state.exchange.currency_id].sell
    } else {
      rate = state.currencies[state.exchange.currency_id].buy
    }
    setState({
      ...state,
      exchange: {
        ...state.exchange,
        action_type: type,
        rate: rate,
        sell_amount: cutFloat(state.exchange.amount * rate)
      }
    });
  }

  function handleExchangeAmountChange(value) {
    setState({
      ...state,
      exchange: {
        ...state.exchange,
        sell_amount: cutFloat(parseFloat(value) * state.exchange.rate),
        amount: value
      }
    })
  }

  function handleInputChange(type, field, value) {
    setState({
      ...state,
      [type]: {
        ...state[type],
        [field]: value
      }
    })
  }

  function handleChangeCurrency(value) {
    const rate = parseFloat(state.currencies[value][state.exchange.action_type]);
    const sell_amount = cutFloat(parseFloat(state.exchange.amount) * rate);
    setState({
      ...state,
      exchange: {
        ...state.exchange,
        currency_id: value,
        rate: rate,
        sell_amount: sell_amount
      }
    })
  }

  function handleModal(modal) {
    setState({
      ...state,
      [modal]: !state[modal]
    })
  }

  function submitCashDesk() {
    $.ajax({
      url: `/currencies/${state.cashDesk.currency_id}/cashdesk.json`,
      type: 'POST',
      data: {
        cashdesk: {
          currency_id: state.cashDesk.currency_id,
          amount: state.cashDesk.amount,
          action_type: state.cashDesk.action_type
        }
      }
    }).then((resp) => {
      if (resp.success) {
        setState({
          ...state,
          cashDeskModal: false,
          cashDesk: {
            ...state.cashDesk,
            currency_id: Object.values(JSON.parse(props.currencies))[0].id,
            amount: '',
            action_type: 'replenishment',
            comment: ''
          },
          currencies: {
            ...state.currencies,
            [resp.currency_id]: {
              ...state.currencies[resp.currency_id],
              total_amount: resp.total_amount
            }
          }
        });
        if (resp.action_type === 'replenishment') {
          swal('????????????', '???????? ??????????????????', "success");
        } else {
          swal('????????????', '???????? ??????????????????????????', "success");
        }
      } else {
        swal('??????????????', resp.error, "error");
      }
    });
  }

  function submitExchange() {
    let currency_id_sell = 0;
    let currency_id_buy = 0;
    if (state.exchange.action_type === 'buy') {
      currency_id_sell = state.exchange.uah_currency_id
      currency_id_buy = state.exchange.currency_id
    } else {
      currency_id_sell = state.exchange.currency_id
      currency_id_buy = state.exchange.uah_currency_id
    }
    $.ajax({
      url: `/currencies/exchange.json`,
      type: 'POST',
      data: {
        exchange: {
          currency_id_sell: currency_id_sell,
          currency_id_buy: currency_id_buy,
          buy_amount: state.exchange.amount,
          comment: state.exchange.comment
        }
      }
    }).then((resp) => {
      if (resp.success) {
        setState({
          ...state,
          exchangeModal: false,
          exchange: {
            ...state.exchange,
            amount: '',
            comment: '',
            sell_amount: ''
          },
          currencies: resp.currencies
        });
        swal('????????????', '?????????? ?????????? ????????????????', "success");
      } else {
        swal('??????????????', resp.error, "error");
      }
    });
  }

  function submitRates() {
    $.ajax({
      url: `/currencies/change_rates.json`,
      type: 'POST',
      data: {
        rates: state.rates
      }
    }).then((resp) => {
      if (resp.success) {
        setState({
          ...state,
          ratesModal: false,
          currencies: resp.currencies
        });
        swal('????????????', '?????????? ???????????? ?????????? ????????????????', "success");
      } else {
        swal('??????????????', resp.error, "error");
      }
    });
  }

  console.log('state', state)

  return (
    <Fragment>
      { state.loaded &&
      <Fragment>
        <div className="container inside">
          <div className="d-flex" style={{alignItems: 'center', justifyContent: 'space-between'}}>
            { JSON.parse(props.admin) &&
            <Fragment>
              <button className='btn btn-success m-1' onClick={() => setState({...state, cashDeskModal: true})}>?????? ?? ??????????</button>
              <button className='btn btn-primary m-1' onClick={() => setState({...state, ratesModal: true})}>?????????? ?????????? ??????????</button>
            </Fragment>}
            <button className='btn btn-danger m-1' onClick={() => setState({...state, exchangeModal: true})}>?????????? ????????????</button>
          </div>
          <div className='row currency-header mt-3'>
            <div className='col-2 text-center currency-header-row'>
              <p>????????????</p>
            </div>
            <div className='col-2 text-center currency-header-row'>
              <p>??????????????</p>
            </div>
            <div className='col-2 text-center currency-header-row'>
              <p>????????????</p>
            </div>
            <div className='col-2 text-center currency-header-row'>
              <p>??????????????</p>
            </div>
            <div className='col-2 text-center currency-header-row'>
              <p>??????????????</p>
            </div>
            <div className='col-2 text-center currency-header-row'>
              <p>????????</p>
            </div>
          </div>
          { Object.values(state.currencies).map((currency, i) =>
            <Fragment key={i}>
              <div className='row currency-rows'>
                <div className='col-2 currency-row text-center'>
                  <img className='currency-icon' src={`/images/${currency.name}.svg`}/>
                  {currency.name}
                </div>
                <div className='col-2 currency-row text-center d-flex'>
                  {currency.buy || '-'}
                </div>
                <div className='col-2 currency-row text-center d-flex'>
                  {currency.sell || '-'}
                </div>
                <div className='col-2 currency-row text-center d-flex'>
                  {currency.bought_today}
                </div>
                <div className='col-2 currency-row text-center d-flex'>
                  {currency.sold_today}
                </div>
                <div className='col-2 currency-row text-center d-flex'>
                  {currency.total_amount}
                </div>
              </div>
            </Fragment>)}
        </div>

        <Modal isOpen={state.cashDeskModal} toggle={() => handleModal('cashDeskModal')} size="lg">
          <div className='container'>
            <ModalHeader>?????? ?? ??????????</ModalHeader>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="cashdesk_action_type" checked={state.cashDesk.action_type === 'replenishment'} onClick={(e) => handleInputChange('cashDesk','action_type', 'replenishment')} />
                ????????????????????
              </Label>
              <Label check>
                <Input type="radio" name="cashdesk_action_type" checked={state.cashDesk.action_type === 'collection'} onClick={(e) => handleInputChange('cashDesk','action_type', 'collection')}/>
                ??????????????????
              </Label>
            </FormGroup>
            <div className='row'>
              <div className='col-6'>
                <FormGroup>
                  <Label for="currency">???????????? <img className='currency-icon-small' src={`/images/${state.currencies[state.cashDesk.currency_id].name}.svg`}/></Label>
                  <Input type="select" name="currency" id="currency" defaultValue={state.cashDesk.currency_id} onChange={(e) => handleInputChange('cashDesk','currency_id', e.target.value)}>
                    { Object.values(state.currencies).map((currency) => {
                      return <option key={currency.id} value={currency.id}>{currency.name}</option>
                    })}
                  </Input>
                </FormGroup>
              </div>
              <div className='col-6'>
                <FormGroup>
                  <Label for="amount">????????</Label>
                  <Input type='number' id='amount' value={state.cashDesk.amount} onChange={(e) => handleInputChange('cashDesk','amount', e.target.value)}/>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <Label for="comment">????????</Label>
              <Input type='textarea' id='comment' value={state.cashDesk.comment} onChange={(e) => handleInputChange('cashDesk','comment', e.target.value)}/>
            </FormGroup>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => handleModal('cashDeskModal')}>??????????????</ButtonToggle>
              <ButtonToggle color="success" onClick={submitCashDesk}>????????????????</ButtonToggle>
            </FormGroup>
          </div>
        </Modal>

        <Modal isOpen={state.exchangeModal} toggle={() => handleModal('exchangeModal')} size="lg">
          <div className='container'>
            <ModalHeader>?????????? ????????????</ModalHeader>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="exchange_action_type" checked={state.exchange.action_type === 'buy'} onClick={(e) => handleExchangeTypeChange('buy')} />
                ??????????????
              </Label>
              <Label check>
                <Input type="radio" name="exchange_action_type" checked={state.exchange.action_type === 'sell'} onClick={(e) => handleExchangeTypeChange('sell')}/>
                ????????????
              </Label>
            </FormGroup>
            <div className='row'>
              <div className='col-6'>
                <FormGroup>
                  <Label for="buy_currency">???????????? <img className='currency-icon-small' src={`/images/${state.currencies[state.exchange.currency_id].name}.svg`}/></Label>
                  <Input type="select" name="currency" id="currency" defaultValue={state.exchange.currency_id} onChange={(e) => handleChangeCurrency(e.target.value)}>
                    { Object.values(state.currencies).map((currency) => {
                      return (
                        <Fragment key={currency.id}>
                          { currency.name !== 'UAH' &&
                          <option value={currency.id}>{currency.name}</option>}
                        </Fragment>)
                    })}
                  </Input>
                </FormGroup>
              </div>
              <div className='col-6'>
                <FormGroup>
                  <Label for="amount">????????</Label>
                  <Input type='number' id='amount' value={state.exchange.amount} onChange={(e) => handleExchangeAmountChange(e.target.value)}/>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <div className='row'>
                <div className='col-sm-6'>
                  <Label>???????? ????????????</Label>
                  <p><b>{state.exchange.rate || '-'}</b></p>
                </div>
                <div className='col-sm-6'>
                  <Label>???? ????????????</Label>
                  <p><b>{state.exchange.sell_amount || '0'}</b> ??????</p>
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="exchange_comment">????????</Label>
              <Input type='textarea' id='exchange_comment' value={state.exchange.comment} onChange={(e) => handleInputChange('exchange','comment', e.target.value)}/>
            </FormGroup>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => handleModal('exchangeModal')}>??????????????</ButtonToggle>
              <ButtonToggle color={state.exchange.action_type === 'buy' ? 'success' : 'warning'} onClick={submitExchange}>{state.exchange.action_type === 'buy' ? '????????????' : '??????????????'}</ButtonToggle>
            </FormGroup>
          </div>
        </Modal>

        <Modal isOpen={state.ratesModal} toggle={() => handleModal('ratesModal')} size="lg">
          <div className='container'>
            <ModalHeader>?????????? ?????????? ??????????</ModalHeader>
              <div className='row'>
                <div className='col-4'>
                  <h4>????????????</h4>
                </div>
                <div className='col-4'>
                  <h4>??????????????</h4>
                </div>
                <div className='col-4'>
                  <h4>????????????</h4>
                </div>
              </div>
              { Object.values(state.currencies).map((currency, i) =>
                <Fragment key={i}>
                  { currency.name !== 'UAH' &&
                    <div className='row mt-2'>
                      <div className='col-4'>
                        <img className='currency-icon' src={`/images/${currency.name}.svg`}/>{currency.name}
                      </div>
                      <div className='col-4'>
                        <Input type='number' id={`buy_amount_${currency.id}`} value={state.rates[currency.id].buy_amount} onChange={(e) => handleRatesChange(currency.id, 'buy_amount', e.target.value)}/>
                      </div>
                      <div className='col-4'>
                        <Input type='number' id={`sell_amount_${currency.id}`} value={state.rates[currency.id].sell_amount} onChange={(e) => handleRatesChange(currency.id, 'sell_amount',  e.target.value)}/>
                      </div>
                    </div>}
                </Fragment>)}
            <FormGroup className="mt-3">
              <ButtonToggle color="secondary" onClick={() => handleModal('ratesModal')}>??????????????</ButtonToggle>
              <ButtonToggle color="success" onClick={submitRates}>????????????????</ButtonToggle>
            </FormGroup>
          </div>
        </Modal>
      </Fragment>}
    </Fragment>
  );
};

export default Currencies;