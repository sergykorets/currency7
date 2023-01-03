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
          swal('Чудово', 'Касу поповнено', "success");
        } else {
          swal('Чудово', 'Касу проінкасовано', "success");
        }
      } else {
        swal('Опаньки', resp.error, "error");
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
        swal('Чудово', 'Обмін валют виконано', "success");
      } else {
        swal('Опаньки', resp.error, "error");
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
        swal('Чудово', 'Зміну курсів валют виконано', "success");
      } else {
        swal('Опаньки', resp.error, "error");
      }
    });
  }

  return (
    <Fragment>
      { state.loaded &&
      <Fragment>
        <div className="container inside">
          <div className="input-submit">
            { JSON.parse(props.admin) &&
            <Fragment>
              <button className='btn-success' onClick={() => setState({...state, cashDeskModal: true})}>Дії з касою</button>
              <button className='btn-primary' onClick={() => setState({...state, ratesModal: true})}>Зміна курсу валют</button>
            </Fragment>}
            <button className='btn-danger' onClick={() => setState({...state, exchangeModal: true})}>Обмін валюти</button>
          </div>
          <table className='dark' style={{marginTop: 20 + 'px'}}>
            <thead>
            <tr>
              <th><h1>Валюта</h1></th>
              <th><h1>Купівля</h1></th>
              <th><h1>Продаж</h1></th>
              <th><h1>Куплено</h1></th>
              <th><h1>Продано</h1></th>
              <th><h1>Каса</h1></th>
            </tr>
            </thead>
            <tbody>
            { Object.values(state.currencies).map((currency) => {
              return (
                <tr key={currency.id}>
                  <td><img className='currency-icon' src={`/images/${currency.name}.svg`}/>{currency.name}</td>
                  <td>{currency.buy || '-'}</td>
                  <td>{currency.sell || '-'}</td>
                  <td>{currency.bought_today}</td>
                  <td>{currency.sold_today}</td>
                  <td>{currency.total_amount}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>

        <Modal isOpen={state.cashDeskModal} toggle={() => handleModal('cashDeskModal')} size="lg">
          <div className='container'>
            <ModalHeader>Дії з касою</ModalHeader>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="cashdesk_action_type" checked={state.cashDesk.action_type === 'replenishment'} onClick={(e) => handleInputChange('cashDesk','action_type', 'replenishment')} />
                Поповнення
              </Label>
              <Label check>
                <Input type="radio" name="cashdesk_action_type" checked={state.cashDesk.action_type === 'collection'} onClick={(e) => handleInputChange('cashDesk','action_type', 'collection')}/>
                Інкасація
              </Label>
            </FormGroup>
            <div className='row'>
              <div className='col-6'>
                <FormGroup>
                  <Label for="currency">Валюта <img className='currency-icon-small' src={`/images/${state.currencies[state.cashDesk.currency_id].name}.svg`}/></Label>
                  <Input type="select" name="currency" id="currency" defaultValue={state.cashDesk.currency_id} onChange={(e) => handleInputChange('cashDesk','currency_id', e.target.value)}>
                    { Object.values(state.currencies).map((currency) => {
                      return <option key={currency.id} value={currency.id}>{currency.name}</option>
                    })}
                  </Input>
                </FormGroup>
              </div>
              <div className='col-6'>
                <FormGroup>
                  <Label for="amount">Сума</Label>
                  <Input type='number' id='amount' value={state.cashDesk.amount} onChange={(e) => handleInputChange('cashDesk','amount', e.target.value)}/>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <Label for="comment">Опис</Label>
              <Input type='textarea' id='comment' value={state.cashDesk.comment} onChange={(e) => handleInputChange('cashDesk','comment', e.target.value)}/>
            </FormGroup>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => handleModal('cashDeskModal')}>Відміна</ButtonToggle>
              <ButtonToggle color="success" onClick={submitCashDesk}>Зберегти</ButtonToggle>
            </FormGroup>
          </div>
        </Modal>

        <Modal isOpen={state.exchangeModal} toggle={() => handleModal('exchangeModal')} size="lg">
          <div className='container'>
            <ModalHeader>Обмін валюти</ModalHeader>
            <FormGroup check>
              <Label check>
                <Input type="radio" name="exchange_action_type" checked={state.exchange.action_type === 'buy'} onClick={(e) => handleExchangeTypeChange('buy')} />
                Купівля
              </Label>
              <Label check>
                <Input type="radio" name="exchange_action_type" checked={state.exchange.action_type === 'sell'} onClick={(e) => handleExchangeTypeChange('sell')}/>
                Продаж
              </Label>
            </FormGroup>
            <div className='row'>
              <div className='col-6'>
                <FormGroup>
                  <Label for="buy_currency">Валюта <img className='currency-icon-small' src={`/images/${state.currencies[state.exchange.currency_id].name}.svg`}/></Label>
                  <Input type="select" name="currency" id="currency" defaultValue={state.exchange.currency_id} onChange={(e) => handleChangeCurrency(e.target.value)}>
                    { Object.values(state.currencies).map((currency) => {
                      return (
                        <Fragment>
                          { currency.name !== 'UAH' &&
                          <option key={currency.id} value={currency.id}>{currency.name}</option>}
                        </Fragment>)
                    })}
                  </Input>
                </FormGroup>
              </div>
              <div className='col-6'>
                <FormGroup>
                  <Label for="amount">Сума</Label>
                  <Input type='number' id='amount' value={state.exchange.amount} onChange={(e) => handleExchangeAmountChange(e.target.value)}/>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <div className='row'>
                <div className='col-sm-6'>
                  <Label>Курс обміну</Label>
                  <p><b>{state.exchange.rate || '-'}</b></p>
                </div>
                <div className='col-sm-6'>
                  <Label>До видачі</Label>
                  <p><b>{state.exchange.sell_amount || '0'}</b> грн</p>
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="exchange_comment">Опис</Label>
              <Input type='textarea' id='exchange_comment' value={state.exchange.comment} onChange={(e) => handleInputChange('exchange','comment', e.target.value)}/>
            </FormGroup>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => handleModal('exchangeModal')}>Відміна</ButtonToggle>
              <ButtonToggle color={state.exchange.action_type === 'buy' ? 'success' : 'warning'} onClick={submitExchange}>{state.exchange.action_type === 'buy' ? 'Купити' : 'Продати'}</ButtonToggle>
            </FormGroup>
          </div>
        </Modal>

        <Modal isOpen={state.ratesModal} toggle={() => handleModal('ratesModal')} size="lg">
          <div className='container'>
            <ModalHeader>Зміна курсу валют</ModalHeader>
            <FormGroup>
              <table className='table' style={{marginTop: 20 + 'px'}}>
                <thead>
                <tr>
                  <th><h1>Валюта</h1></th>
                  <th><h1>Купівля</h1></th>
                  <th><h1>Продаж</h1></th>
                </tr>
                </thead>
                <tbody>
                { Object.values(state.currencies).map((currency) => {
                  return (
                    <Fragment>
                      { currency.name !== 'UAH' &&
                      <tr key={currency.id}>
                        <td><img className='currency-icon' src={`/images/${currency.name}.svg`}/>{currency.name}</td>
                        <td><Input type='number' id={`buy_amount_${currency.id}`} value={state.rates[currency.id].buy_amount} onChange={(e) => handleRatesChange(currency.id, 'buy_amount', e.target.value)}/></td>
                        <td><Input type='number' id={`sell_amount_${currency.id}`} value={state.rates[currency.id].sell_amount} onChange={(e) => handleRatesChange(currency.id, 'sell_amount',  e.target.value)}/></td>
                      </tr>}
                    </Fragment>
                  )
                })}
                </tbody>
              </table>
            </FormGroup>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => handleModal('ratesModal')}>Відміна</ButtonToggle>
              <ButtonToggle color="success" onClick={submitRates}>Зберегти</ButtonToggle>
            </FormGroup>
          </div>
        </Modal>
      </Fragment>}
    </Fragment>
  );
};

export default Currencies;