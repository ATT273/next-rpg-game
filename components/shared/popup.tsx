import React, { useEffect, useState } from 'react'

const intro = {
  transition: 'all 500ms ease-out'
}

const defaultSize = {
  width: '100px',
  height: '100px'
}

const bigSize = {
  width: '300px',
  height: '200px'
}
const PopUp = (props) => {
  const { display, title, renderButtons, renderInfo, size } = props
  const [popupSize, setPopupSize] = useState(defaultSize)
  useEffect(() => {
    if (size === 'big') {
      setPopupSize(bigSize)
    } else {
      setPopupSize(defaultSize)
    }
  }, [size])



  const renderPopUpButtons = () => {
    return (
      <div className="popup__button button-group">
        <button className='btn bg-green' onClick={handleReady}>READY!</button>
      </div>
    )
  }

  const renderPopUpInfo = () => {
    const { content } = props
    return (
      <div className="popup__info">
        <div>{content}</div>
      </div>
    )
  }

  const handleReady = () => {
    props.handleReady()
  }
  return (
    <div className="popup bg-red" style={{ ...intro, ...popupSize, display: display }}>
      <div className="popup__container">
        <h3 className='popup__title'>{title}</h3>
        <div className="popup__content">
          {
            renderInfo &&
            renderPopUpInfo()
          }
          {
            renderButtons &&
            renderPopUpButtons()
          }
        </div>
      </div>
    </div>
  )
}

export default PopUp
