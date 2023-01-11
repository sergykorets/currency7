import React, {Fragment, useState} from 'react';
import ReactDOMServer from 'react-dom/server'
import Pagination from "react-js-pagination";
import $ from 'jquery';
import swal from "sweetalert";

const Actions = (props) => {
  const [state, setState] = useState({
    actions: JSON.parse(props.actions),
    activePage: 1,
    count: props.count
  });

  function handlePageChange(page) {
    $.ajax({
      url: '/transactions.json',
      type: 'GET',
      data: { page: page },
      success: (resp) => {
        setState({...state, actions: resp.actions, activePage: page})
      }
    });
  }

  function cancelAction(action_id) {
    if (window.confirm("Відмінити транзакцію?")) {
      $.ajax({
        url: `/transactions/${action_id}/cancel.json`,
        type: 'PATCH',
        data: {
          page: state.activePage
        },
        success: (resp) => {
          if (resp.success) {
            swal('Чудово', 'Транзакцію відмінено', "success");
            setState({...state, actions: resp.actions, activePage: state.activePage})
          } else {
            swal('Опаньки', 'Можна відміняти лише сьогоднішні транзакції', "error");
          }
        }
      });
    }
  }

  function printAction(action_id) {
    if (window.confirm("Роздрукувати чек?")) {
      const content =
        <div style={{width: 300+'px'}} className='container'>
          <div className='row'>
            <p style={{lineHeight: 1+'rem', marginBottom: 1+'px', fontSize: 0.75+'rem', paddingBottom: 0}}>Товариство з обмеженою відповідальністю "Фінансова компанія Октава Фінанс"</p>
            <p style={{lineHeight: 1+'rem', marginBottom: 1+'px', fontSize: 0.75+'rem', paddingBottom: 0}}>Рівненське відділення №15</p>
            <p style={{lineHeight: 1+'rem', fontSize: 0.75+'rem'}}>34700 Рівненська обл. м. Корець, пл. Київська, 3</p>
            <p style={{textAlign: 'center', marginTop: 1+'rem', marginBottom: 1+'rem'}}>КВИТАНЦІЯ №{state.actions[action_id].number}</p>
            <table>
              <tbody>
              <tr>
                <td style={{paddingRight: 3+'rem'}}>Сума</td>
                <td>{state.actions[action_id].buy_amount} {state.actions[action_id].currency_sell}</td>
              </tr>
              <tr>
                <td style={{paddingRight: 3+'rem'}}>До видачі</td>
                <td>{state.actions[action_id].sell_amount} {state.actions[action_id].currency_buy}</td>
              </tr>
              <tr>
                <td style={{paddingRight: 3+'rem'}}>Курс</td>
                <td>{state.actions[action_id].rate}</td>
              </tr>
              <tr>
                <td style={{paddingRight: 3+'rem'}}>Дата</td>
                <td>{state.actions[action_id].created_at}</td>
              </tr>
              </tbody>
            </table>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 6+'rem'}}>
              <span>ФІСКАЛЬНИЙ ЧЕК</span><span>ІКС</span>
            </div>
          </div>
        </div>;
      const pri = document.getElementById("ifmcontentstoprint").contentWindow;
      pri.document.open();
      pri.document.write(ReactDOMServer.renderToString(content));
      pri.document.close();
      pri.focus();
      pri.print();
    }
  }

  return (
    <Fragment>
      <iframe id="ifmcontentstoprint" style={{height: 0+'px', width: 0+'px', position: 'absolute'}}/>
      <div className="container inside">
        <div style={{color: 'white', position: 'relative'}} className='row'>
          <div className='col-3'>
            <div className='row' style={{position: 'relative'}}>
              <div className='actions-cell col-2 currency-row d-flex text-center'>№</div>
              <div className='actions-cell col-5 currency-row text-center'>Куп</div>
              <div className='actions-cell col-5 currency-row text-center'>Прод</div>
            </div>
          </div>
          <div className='col-4'>
            <div className='row' style={{position: 'relative'}}>
              <div className='actions-cell col-6 currency-row d-flex text-center'>Куп</div>
              <div className='actions-cell col-6 currency-row d-flex text-center'>Прод</div>
            </div>
          </div>
          <div className='col-5'>
            <div className='row' style={{position: 'relative'}}>
              <div className='actions-cell col-4 currency-row d-flex text-center'>Курс</div>
              <div className='actions-cell col-6 currency-row d-flex text-center'>Дата</div>
              <div className='actions-cell col-2 currency-row text-center'>Дії</div>
            </div>
          </div>
        </div>
        <div className='d-block'>
          { Object.values(state.actions).reverse().map((action, index) => {
            return (
              <div key={index} style={{color: 'white', position: 'relative'}}
                   className={`row ${action.is_canceled ? 'canceled' : (action.currency_sell === 'UAH' ? 'sell' : 'buy')}`}>
                <div className='col-3'>
                  <div className='row' style={{position: 'relative'}}>
                    <div className='actions-cell col-2 currency-row d-flex text-center'>{action.number}</div>
                    <div className='actions-cell col-5 currency-row text-center'>
                      <img style={{height: '20px'}} src={`/images/${action.currency_sell}.svg`}/>{action.currency_sell}
                    </div>
                    <div className='actions-cell col-5 currency-row text-center'>
                      <img style={{height: '20px'}} src={`/images/${action.currency_buy}.svg`}/>{action.currency_buy}
                    </div>
                  </div>
                </div>
                <div className='col-4 currency-row'>
                  <div className='row' style={{position: 'relative'}}>
                    <div className='actions-cell col-6 currency-row d-flex text-center'>{action.buy_amount}</div>
                    <div className='actions-cell col-6 currency-row d-flex text-center'>{action.sell_amount}</div>
                  </div>
                </div>
                <div className='col-5'>
                  <div className='row' style={{position: 'relative'}}>
                    <div className='actions-cell col-4 currency-row d-flex text-center'>{action.rate}</div>
                    <div className='actions-cell col-6 currency-row d-flex text-center'>{action.created_at}</div>
                    <div className='actions-cell col-2 currency-row text-center'>
                      <i onClick={() => cancelAction(action.id)} className="fa fa-ban d-block mb-1 mt-1" style={{color: 'red'}}/>
                      <i onClick={() => printAction(action.id)} className="fa fa-print d-block"/>
                    </div>
                  </div>
                </div>
              </div>)})}
        </div>
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

export default Actions;