import React, {Fragment, useState} from 'react';
import Pagination from "react-js-pagination";
import $ from 'jquery';

const Versions = (props) =>  {
  const [state, setState] = useState({
    versions: JSON.parse(props.versions),
    activePage: 1,
    count: props.count
  });

  function handlePageChange(page) {
    $.ajax({
      url: '/versions.json',
      type: 'GET',
      data: { page: page },
      success: (resp) => {
        setState({...state, versions: resp.versions, activePage: page})
      }
    });
  }

  return (
    <Fragment>
      <div className="container inside">
        <table className='dark' style={{marginTop: 20 + 'px'}}>
          <thead>
          <tr>
            <th>Валюта</th>
            <th>Купівля</th>
            <th>Продаж</th>
            <th>Дата</th>
          </tr>
          </thead>
          <tbody>
          { state.versions.map((version, index) => {
            return (
              <tr key={index}>
                <td><img className='currency-icon' src={`/images/${version.currency}.svg`}/>{version.currency}</td>
                <td>
                  { version.currency_buy_change_rate ?
                    <Fragment>
                      <span>{version.currency_buy_change_rate[0]}</span> {'=>'} <span className={parseFloat(version.currency_buy_change_rate[1]) > parseFloat(version.currency_buy_change_rate[0]) ? 'green' : 'yellow'}>{version.currency_buy_change_rate[1]}</span>
                    </Fragment> : 'Без змін'}
                </td>
                <td>
                  { version.currency_sell_change_rate ?
                    <Fragment>
                      <span>{version.currency_sell_change_rate[0]}</span> {'=>'} <span className={parseFloat(version.currency_sell_change_rate[1]) > parseFloat(version.currency_sell_change_rate[0]) ? 'green' : 'yellow'}>{version.currency_sell_change_rate[1]}</span>
                    </Fragment> : 'Без змін'}
                </td>
                <td>{version.created_at}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
        { state.count > 10 &&
        <Fragment>
          <Pagination
            activePage={state.activePage}
            itemsCountPerPage={10}
            totalItemsCount={state.count}
            pageRangeDisplayed={4}
            onChange={handlePageChange}
          />
          <hr/>
        </Fragment>}
      </div>
    </Fragment>
  );
};

export default Versions;
