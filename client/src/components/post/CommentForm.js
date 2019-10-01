import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TextAreaFieldGroup from '../../common/TextAreaFieldGroup'
import{addComment} from '../../actions/postActions'


class CommentForm extends Component {
      

     state = {
          text: '',
          errors:{}
     }

     componentWillReceiveProps(nextProps) {
          if (nextProps.errors) {
               this.setState({errors:nextProps.errors})
          }
     }

     onSubmit = (e) => {
          e.preventDefault()
          const { user } = this.props.auth
          const { postId } = this.props
          const newComment = {
               text: this.state.text,
               name: user.name,
               avatar:user.avatar
          }

          this.props.addComment(postId,newComment)
          this.setState({text:''})
  }
     onChange = (e) => {
      this.setState({[e.target.name]:e.target.value})
 }


     render() {
          const{errors} = this.state
          return (
               <div class="post-form mb-3">
            <div class="card card-info">
              <div class="card-header bg-info text-white">
               Reply to the post..
              </div>
              <div class="card-body">
                <form onSubmit={this.onSubmit}>
                  <div class="form-group">
                                        <TextAreaFieldGroup
                                             placeholder="write a comment"
                                             name="text"
                                             onChange={this.onChange}
                                             value={this.state.text}
                                             error={errors.text}
                                        />
                  </div>
                  <button type="submit" class="btn btn-dark">Submit</button>
                </form>
              </div>
            </div>
          </div>
          )
     }
}

CommentForm.propTypes = {
     addPost: PropTypes.func.isRequired,
     postId:PropTypes.string.isRequired,
     auth: PropTypes.object.isRequired,
   errors:PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
     auth: state.auth,
     errors:state.errors
})

export default connect(mapStateToProps,{addComment})(CommentForm)
