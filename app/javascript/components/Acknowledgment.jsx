import React from 'react';

const Acknowledgment = () => {
  return (
    <div id='new_rates_acknowledgment' className='modal show fade in acknowledgments' tabIndex='-1' role='dialog' data-keyboard='false' data-backdrop='static'>
      <div className='modal-dialog' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>Увага! Курс валют було змінено!</h5>
          </div>
          <div className='modal-body'>
            <p>Натисніть на кнопку 'Зрозуміло' та подивіться на оновлену інформацію</p>
          </div>
          <div className='modal-footer'>
            <form className='edit_user' id='edit_user' action='/users/submit_acknowledgment' acceptCharset='UTF-8' method='post'>
              <input name='utf8' type='hidden' value='✓'/>
              <input type='hidden' name='_method' value='patch'/>
              <input value='new_rates' type='hidden' name='user[acknowledgment_type]' id='user_acknowledgment_type'/>
              <input type='submit' name='commit' value='Зрозуміло' className='btn btn-primary' data-disable-with='Зрозуміло'/>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acknowledgment;
