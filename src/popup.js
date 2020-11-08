import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Popup extends Component {
  constructor (props) {
    super(props)
    const { name = '', cardDesc = '', currentComment = '', comments = [] } = props.data
    this.state = {
      name,
      cardDesc,
      currentComment,
      comments,
      category: props.category
    }
  }

  handleChange = (event, element) => {
    this.setState({ [element]: event.target.value })
  }

  addComment = () => {
    const d = new Date()
    if (this.state.currentComment) {
      const comment = {
        comment: this.state.currentComment,
        date: d.toDateString()
      }
      this.setState({
        currentComment: '',
        comments: this.state.comments.concat(comment)
      })
    }
  }

  deleteCard = () => {
    this.props.deleteCard(this.props.category, this.state)
  }

  addCard = () => {
    this.props.addCard(this.props.category, this.state)
  }

  updateCard = () => {
    this.props.updateCard(this.props.category, this.state, this.props.data.name)
  }

  render () {
    const commentList = this.state.comments.map((data, index) =>
        <li key={index}>{data.comment} {data.date}</li>
    )
    return (
        <div className='popup'>
          <div className='popup_inner'>
          <button onClick={this.props.closePopup}>close me</button>
            <div className="container">
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="name">Card Name:</label>
                    </div>
                    <div className="col-50">
                        <input type="text"
                        id="name"
                        name='name'
                        value={this.state.name}
                        onChange={(e) => this.handleChange(e, 'name')}
                        />
                    </div>
                    <div className="col-25">
                        <button onClick={this.deleteCard}>Delete card</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="cardDesc">Card Description:</label>
                    </div>
                    <div className="col-50">
                        <textarea
                        id="cardDesc"
                        name="cardDesc"
                         value={this.state.cardDesc}
                         onChange={(e) => this.handleChange(e, 'cardDesc')}
                         />
                    </div>
                    <div className="col-25">
                        {this.props.data.name
                          ? <button onClick={this.updateCard}>update card</button>
                          : <button onClick={this.addCard}>Add card</button>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="cardComment">Card comment:</label>
                    </div>
                    <div className="col-75">
                        <input type="text"
                        id="cardComment"
                        name='cardComment'
                        value={this.state.currentComment}
                        onChange={(e) => this.handleChange(e, 'currentComment')}
                        />
                    </div>
                </div>
                <div className="row">
                    <button onClick={this.addComment}>Add comment</button>
                </div>
                <div className="row">
                    <ul className="col-50">
                     {commentList}
                    </ul>
                </div>
            </div>
          </div>
        </div>
    )
  }
}

Popup.propTypes = {
  closePopup: PropTypes.func,
  data: PropTypes.object,
  deleteCard: PropTypes.func,
  addCard: PropTypes.func,
  updateCard: PropTypes.func,
  category: PropTypes.string
}
