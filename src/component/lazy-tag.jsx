import React from 'react';

export default class Z extends React.Component {

  static defaultProps = { t: 'div', onTransitionEnd(){} };

  render(){
    let { t, children, ...otherProps } = this.props;
    otherProps.ref = 'me';

    return React.createElement(
      t, otherProps, children
    );
  }

  componentDidMount(){
    this.me = this.refs.me.getDOMNode();

    this.transitionEndListener = e => {
      this.props.onTransitionEnd(e);
    }.bind(this);

    this.me.addEventListener('transitionend', this.transitionEndListener);

    //this.props.onTransitionEnd();
  }

  componentDidUpdate(prevProps, prevState){
    /*if(prevProps.style.top === this.props.style.top
      && prevProps.style.left === this.props.style.left
      && prevProps.style.opacity === this.props.style.opacity){
      console.log('nuttin changed');
      this.props.onTransitionEnd();
    }*/
  }

  componentWillUnmount(){
    this.me.removeEventListener('transitionend', this.transitionEndListener);
  }

}
