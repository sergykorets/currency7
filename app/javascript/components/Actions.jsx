import React, {Fragment, useState} from 'react';
import Pagination from "react-js-pagination";
import $ from 'jquery';

const Actions = (props) => {
  const [state, setState] = useState({
    actions: JSON.parse(props.actions),
    activePage: 1,
    count: props.count
  });

  function handlePageChange(page) {
    $.ajax({
      url: '/actions.json',
      type: 'GET',
      data: { page: page },
      success: (resp) => {
        setState({...state, actions: resp.actions, activePage: page})
      }
    });
  }

  const translations = {
    collection: 'Інкасація',
    replenishment: 'Поповнення'
  };

  return (
    <Fragment>
      <div className="container inside">
        <table className='dark' style={{marginTop: 20 + 'px'}}>
          <thead>
          <tr>
            <th><h1>Тип</h1></th>
            <th><h1>Валюта</h1></th>
            <th><h1>Сума</h1></th>
            <th><h1>Дата</h1></th>
          </tr>
          </thead>
          <tbody>
          { state.actions.map((action, index) => {
            return (
              <tr key={index} className={action.action_type === 'collection' ? 'sell' : 'buy'}>
                <td>{translations[action.action_type]}</td>
                <td><img className='currency-icon' src={`/images/${action.currency}.svg`}/>{action.currency}</td>
                <td>{action.amount}</td>
                <td>{action.created_at}</td>
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
            pageRangeDisplayed={9}
            onChange={handlePageChange}
          />
          <hr/>
        </Fragment>}
      </div>
    </Fragment>
  );
};

export default Actions;
